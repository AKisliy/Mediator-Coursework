/**
 * @jest-environment node
 */
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

import {
  authenticate,
  login,
  proceedVerification,
  refreshAccessToken,
  register,
  resetPassword,
  setNewPassword
} from '@/app/actions/auth.action';
import { getRefreshToken } from '@/app/actions/data/refresh-token';
import * as resetTokenUtils from '@/app/actions/data/reset-token';
import * as verificationTokenUtils from '@/app/actions/data/token';
import * as userUtils from '@/app/actions/data/user';
import { getCurrentUserId } from '@/app/api/auth/utils';
import { signIn } from '@/auth';
import { withAuth } from '@/lib/auth-wrapper';
import { prisma } from '@/lib/db/prisma';
import * as mailUtils from '@/lib/mail';
import * as tokenUtils from '@/lib/tokens';
import * as utils from '@/lib/utils';
import { AuthWrapperError } from '@/types/errors/auth-wrapper-error';

jest.mock('@auth/core', () => ({
  Auth: jest.fn(),
  customFetch: jest.fn()
}));
jest.mock('@panva/hkdf', () => ({
  derive: jest.fn()
}));
jest.mock('jose', () => ({
  jwtVerify: jest.fn(),
  SignJWT: jest.fn()
}));
jest.mock('@/lib/db/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
      create: jest.fn()
    },
    verificationToken: {
      delete: jest.fn()
    },
    passwordResetToken: {
      delete: jest.fn()
    }
  }
}));
jest.mock('@/auth', () => ({
  signIn: jest.fn()
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}));
jest.mock('@/lib/tokens', () => ({
  generateVerificationToken: jest.fn(),
  generatePasswordResetToken: jest.fn()
}));
jest.mock('@/lib/mail', () => ({
  sendVerificationEmail: jest.fn(),
  sendResetPasswordEmail: jest.fn()
}));
jest.mock('@/app/actions/data/user', () => ({
  getUserByEmail: jest.fn()
}));
jest.mock('@/app/actions/data/reset-token', () => ({
  getPasswordResetTokenByToken: jest.fn()
}));
jest.mock('@/app/actions/data/token', () => ({
  getVerificationTokenByToken: jest.fn()
}));
jest.mock('@/app/actions/data/refresh-token', () => ({
  getRefreshToken: jest.fn()
}));
jest.mock('@/lib/utils', () => ({
  generateUniqueUsername: jest.fn(),
  generateAvatar: jest.fn()
}));
jest.mock('next-auth');
jest.mock('@/app/api/auth/utils', () => ({
  getCurrentUserId: jest.fn()
}));

describe('Auth Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should return success when valid email is provided', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      (signIn as jest.Mock).mockResolvedValue(undefined);

      const result = await authenticate(null, formData);

      expect(signIn).toHaveBeenCalledWith('email', {
        callbackUrl: '/',
        email: 'test@example.com'
      });
      expect(result).toEqual({ success: true });
    });

    it('should return error for invalid email', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');

      const result = await authenticate(null, formData);

      expect(result).toEqual({
        error: 'Пожалуйста, введите корректный email адрес'
      });
    });

    it('should handle signIn errors', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      (signIn as jest.Mock).mockRejectedValue(new Error('Sign-in error'));

      const result = await authenticate(null, formData);

      expect(result).toEqual({
        error:
          'Произошла ошибка при отправке ссылки. Пожалуйста, попробуйте снова.'
      });
    });
  });

  describe('proceedVerification', () => {
    it('should verify email with valid token', async () => {
      const token = 'valid-token';
      const user = { id: 'user-id', email: 'test@example.com' };
      const verificationToken = {
        identifier: 'test@example.com',
        token,
        expires: new Date(Date.now() + 10000)
      };
      (
        verificationTokenUtils.getVerificationTokenByToken as jest.Mock
      ).mockResolvedValue(verificationToken);
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (prisma.user.update as jest.Mock).mockResolvedValue({});
      (prisma.verificationToken.delete as jest.Mock).mockResolvedValue({});

      const result = await proceedVerification(token);

      expect(
        verificationTokenUtils.getVerificationTokenByToken
      ).toHaveBeenCalledWith(token);
      expect(userUtils.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: {
          emailVerified: expect.any(Date),
          email: verificationToken.identifier
        }
      });
      expect(prisma.verificationToken.delete).toHaveBeenCalledWith({
        where: {
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token
          }
        }
      });
      expect(result).toEqual({ success: 'Почта подтверждена ✅' });
    });

    it('should return error if token not found', async () => {
      (
        verificationTokenUtils.getVerificationTokenByToken as jest.Mock
      ).mockResolvedValue(null);

      const result = await proceedVerification('invalid-token');

      expect(result).toEqual({ error: 'Токен не найден.' });
    });

    it('should return error if token expired', async () => {
      const verificationToken = {
        identifier: 'test@example.com',
        token: 'expired-token',
        expires: new Date(Date.now() - 10000)
      };
      (
        verificationTokenUtils.getVerificationTokenByToken as jest.Mock
      ).mockResolvedValue(verificationToken);

      const result = await proceedVerification('expired-token');

      expect(result).toEqual({ error: 'Недействительный токен' });
    });

    it('should return error if user not found', async () => {
      const verificationToken = {
        identifier: 'test@example.com',
        token: 'valid-token',
        expires: new Date(Date.now() + 10000)
      };
      (
        verificationTokenUtils.getVerificationTokenByToken as jest.Mock
      ).mockResolvedValue(verificationToken);
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);

      const result = await proceedVerification('valid-token');

      expect(result).toEqual({ error: 'Пользователь с вашим email не найден' });
    });
  });

  describe('login', () => {
    it('should log in with valid credentials', async () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (signIn as jest.Mock).mockResolvedValue(undefined);

      const result = await login(data);

      expect(userUtils.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: user.email,
        password: data.password,
        redirectTo: '/'
      });
      expect(result).toEqual({ success: 'Успешный вход' });
    });

    it('should return error for invalid schema', async () => {
      const data = { email: 'invalid', password: '' };
      const result = await login(data);

      expect(result).toEqual({ error: 'Введены некорректные данные' });
    });

    it('should return error if user does not exist', async () => {
      const data = { email: 'test@example.com', password: 'password123' };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);

      const result = await login(data);

      expect(result).toEqual({
        error: 'Пользователя с таким аккаунтом не существует'
      });
    });

    it('should handle CredentialsSignin error', async () => {
      const data = { email: 'test@example.com', password: 'wrong-password' };
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(user);
      const authError = new AuthError('CredentialsSignin');
      authError.name = 'CredentialsSignin';
      (signIn as jest.Mock).mockRejectedValue(authError);

      const result = await login(data);

      expect(result).toEqual({ error: 'Указаны неверные данные' });
    });

    it('should handle unverified email error', async () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const user = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashed-password'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(user);
      const authError = new AuthError('EmailNotVerified');
      authError.name = 'EmailNotVerified';
      (signIn as jest.Mock).mockRejectedValue(authError);

      const result = await login(data);

      expect(result).toEqual({ error: 'Пожалуйста, подтвердите свой email' });
    });
  });

  it("should throw error if it's not AuthError", async () => {
    const data = { email: 'test@example.com', password: 'password123' };
    const user = {
      id: 'user-id',
      email: 'test@example.com',
      password: 'hashed-password'
    };
    (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(user);
    const someError = new Error('EmailNotVerified');
    (signIn as jest.Mock).mockRejectedValue(someError);

    await expect(login(data)).rejects.toThrow(Error);
  });

  describe('register', () => {
    it('should register a new user and send verification email', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        passwordConfirmation: 'password123'
      };
      const hashedPassword = 'hashed-password';
      const username = 'unique-username';
      const avatar = 'avatar-uri';
      const verificationToken = {
        identifier: 'test@example.com',
        token: 'verification-token'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (utils.generateUniqueUsername as jest.Mock).mockReturnValue(username);
      (utils.generateAvatar as jest.Mock).mockReturnValue(avatar);
      (prisma.user.create as jest.Mock).mockResolvedValue({});
      (tokenUtils.generateVerificationToken as jest.Mock).mockResolvedValue(
        verificationToken
      );
      (mailUtils.sendVerificationEmail as jest.Mock).mockResolvedValue({});

      const result = await register(data);

      expect(userUtils.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          username,
          password: hashedPassword,
          image: avatar
        }
      });
      expect(tokenUtils.generateVerificationToken).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(mailUtils.sendVerificationEmail).toHaveBeenCalledWith(
        'test@example.com',
        verificationToken.token,
        'http://localhost:3000',
        expect.any(Object)
      );
      expect(result).toEqual({
        success: 'Письмо для подтверждения отправлено на почту'
      });
    });

    it('should return error for invalid schema', async () => {
      const data = {
        email: 'invalid',
        name: '',
        password: '',
        passwordConfirmation: ''
      };
      const result = await register(data);

      expect(result).toEqual({ error: 'Неверный формат входных данных' });
    });

    it('should return error if user already exists', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        passwordConfirmation: 'password123'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue({
        id: 'user-id'
      });

      const result = await register(data);

      expect(result).toEqual({
        error: 'Пользователь с таким email уже существует'
      });
    });

    it('should handle database timeout error', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        passwordConfirmation: 'password123'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockRejectedValue({
        code: 'ETIMEDOUT'
      });

      const result = await register(data);

      expect(result).toEqual({
        error: 'Не удается подключиться к базе данных. Повторите позже'
      });
    });

    it('should handle 503 error', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        passwordConfirmation: 'password123'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockRejectedValue({
        code: '503'
      });

      const result = await register(data);

      expect(result).toEqual({
        error: 'Сервис временно недоступен. Повторите попытку позже.'
      });
    });

    it('should handle unknown error', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        passwordConfirmation: 'password123'
      };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockRejectedValue({});

      const result = await register(data);

      expect(result).toEqual({
        error: 'Произошла непредвиденная ошибка. Попробуйте позднее.'
      });
    });
  });

  describe('resetPassword', () => {
    it('should send reset password email for existing user', async () => {
      const data = { email: 'test@example.com' };
      const user = { id: 'user-id', email: 'test@example.com' };
      const token = { identifier: 'test@example.com', token: 'reset-token' };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (tokenUtils.generatePasswordResetToken as jest.Mock).mockResolvedValue(
        token
      );
      (mailUtils.sendResetPasswordEmail as jest.Mock).mockResolvedValue({});

      const result = await resetPassword(data);

      expect(userUtils.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(tokenUtils.generatePasswordResetToken).toHaveBeenCalledWith(
        'test@example.com'
      );
      expect(mailUtils.sendResetPasswordEmail).toHaveBeenCalledWith(
        'test@example.com',
        token.token,
        'http://localhost:3000',
        expect.any(Object)
      );
      expect(result).toEqual({ success: 'Ссылка отправлена на почту' });
    });

    it('should return success even if user does not exist', async () => {
      const data = { email: 'test@example.com' };
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);

      const result = await resetPassword(data);

      expect(result).toEqual({ success: 'Ссылка отправлена на почту' });
    });

    it('should return error for invalid email', async () => {
      const data = { email: 'invalid' };
      const result = await resetPassword(data);

      expect(result).toEqual({ error: 'Неверный email' });
    });
  });

  describe('setNewPassword', () => {
    it('should update password with valid token and data', async () => {
      const data = { password: 'new-password123' };
      const token = 'valid-token';
      const resetToken = {
        identifier: 'test@example.com',
        token,
        expires: new Date(Date.now() + 10000)
      };
      const user = { id: 'user-id', email: 'test@example.com' };
      const hashedPassword = 'hashed-new-password';
      (
        resetTokenUtils.getPasswordResetTokenByToken as jest.Mock
      ).mockResolvedValue(resetToken);
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (prisma.user.update as jest.Mock).mockResolvedValue({});
      (prisma.passwordResetToken.delete as jest.Mock).mockResolvedValue({});

      const result = await setNewPassword(data, token);

      expect(resetTokenUtils.getPasswordResetTokenByToken).toHaveBeenCalledWith(
        token
      );
      expect(userUtils.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('new-password123', 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      expect(prisma.passwordResetToken.delete).toHaveBeenCalledWith({
        where: {
          identifier_token: {
            identifier: resetToken.identifier,
            token: resetToken.token
          }
        }
      });
      expect(result).toEqual({ success: 'Пароль успешно обновлен' });
    });

    it('should return error if token is null', async () => {
      const data = { password: 'new-password123' };
      const result = await setNewPassword(data, null);

      expect(result).toEqual({ error: 'Токен не найден' });
    });

    it('should return error for invalid schema', async () => {
      const data = { password: '' };
      const result = await setNewPassword(data, 'valid-token');

      expect(result).toEqual({ error: 'Некорректно заполнены поля' });
    });

    it('should return error if token does not exist', async () => {
      const data = { password: 'new-password123' };
      (
        resetTokenUtils.getPasswordResetTokenByToken as jest.Mock
      ).mockResolvedValue(null);

      const result = await setNewPassword(data, 'invalid-token');

      expect(result).toEqual({ error: 'Токен не существует' });
    });

    it('should return error if token expired', async () => {
      const data = { password: 'new-password123' };
      const resetToken = {
        identifier: 'test@example.com',
        token: 'expired-token',
        expires: new Date(Date.now() - 10000)
      };
      (
        resetTokenUtils.getPasswordResetTokenByToken as jest.Mock
      ).mockResolvedValue(resetToken);

      const result = await setNewPassword(data, 'expired-token');

      expect(result).toEqual({ error: 'Действие токена закончилось' });
    });

    it('should return error if user not found', async () => {
      const data = { password: 'new-password123' };
      const resetToken = {
        identifier: 'test@example.com',
        token: 'valid-token',
        expires: new Date(Date.now() + 10000)
      };
      (
        resetTokenUtils.getPasswordResetTokenByToken as jest.Mock
      ).mockResolvedValue(resetToken);
      (userUtils.getUserByEmail as jest.Mock).mockResolvedValue(null);

      const result = await setNewPassword(data, 'valid-token');

      expect(result).toEqual({ error: 'Пользователь с email не найден' });
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const token = {
        sub: 'user-id',
        refresh_token: 'valid-refresh-token',
        expires_at: new Date(),
        access_token: 'access-token'
      };
      const refreshTokenInDb = {
        refreshToken: 'valid-refresh-token',
        refreshTokenExpires: new Date(Date.now() + 10000)
      };
      (getRefreshToken as jest.Mock).mockResolvedValue(refreshTokenInDb);

      const result = await refreshAccessToken(token);

      expect(getRefreshToken).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({
        ...token,
        expiresAt: expect.any(Date)
      });
    });

    it('should throw error if refresh token not found', async () => {
      const token = {
        sub: 'user-id',
        refresh_token: 'valid-refresh-token',
        access_token: 'access_token',
        expires_at: new Date()
      };
      (getRefreshToken as jest.Mock).mockResolvedValue(null);

      await expect(refreshAccessToken(token)).rejects.toThrow(
        'Refresh токен пользователя не найден'
      );
    });

    it('should throw error if refresh tokens do not match', async () => {
      const token = {
        sub: 'user-id',
        refresh_token: 'valid-refresh-token',
        access_token: 'token',
        expires_at: new Date()
      };
      const refreshTokenInDb = {
        refreshToken: 'different-refresh-token',
        refreshTokenExpires: new Date(Date.now() + 10000)
      };
      (getRefreshToken as jest.Mock).mockResolvedValue(refreshTokenInDb);

      await expect(refreshAccessToken(token)).rejects.toThrow(
        'Refresh токены не совпадают'
      );
    });

    it('should throw error if refresh token expired', async () => {
      const token = {
        sub: 'user-id',
        refresh_token: 'valid-refresh-token',
        access_token: 'access-token',
        expires_at: new Date()
      };
      const refreshTokenInDb = {
        refreshToken: 'valid-refresh-token',
        refreshTokenExpires: new Date(Date.now() - 10000)
      };
      (getRefreshToken as jest.Mock).mockResolvedValue(refreshTokenInDb);

      await expect(refreshAccessToken(token)).rejects.toThrow(
        'Действие Refresh токена истекло'
      );
    });
  });
});

describe('withAuth wrapper', () => {
  it('calls inner function if user is authenticated', async () => {
    const mockFn = jest.fn(async () => 'ok');
    (getCurrentUserId as jest.Mock).mockResolvedValue('some-user-id');

    const wrapped = withAuth(mockFn);
    await wrapped();

    expect(mockFn).toHaveBeenCalled();
  });

  it('throws AuthWrapperError if user is not authenticated', async () => {
    (getCurrentUserId as jest.Mock).mockResolvedValue(null);

    const wrapped = withAuth(
      async () =>
        // внутренняя логика тут не важна
        'some result'
    );

    await expect(wrapped()).rejects.toThrow(AuthWrapperError);
  });
});
