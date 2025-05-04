/**
 * @jest-environment node
 */
import { createClient } from '@supabase/supabase-js';

import {
  deleteCurrentAvatar,
  getAvatarUploadUrl
} from '@/app/actions/storage.action';
import { verifySessionAndGetId } from '@/app/api/auth/utils';

jest.mock('@/app/api/auth/utils', () => ({
  verifySessionAndGetId: jest.fn()
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    storage: {
      from: jest.fn().mockReturnValue({
        createSignedUploadUrl: jest.fn(),
        list: jest.fn(),
        remove: jest.fn()
      })
    }
  })
}));

describe('getAvatarUploadUrl', () => {
  const mockUserId = '11223344';
  const mockFileName = 'test.png';
  const mockCreateSignedUploadUrl = (createClient as jest.Mock)().storage.from()
    .createSignedUploadUrl;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify users session', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockCreateSignedUploadUrl as jest.Mock).mockResolvedValue({
      data: 'url.com',
      error: ''
    });

    await getAvatarUploadUrl(mockUserId, mockFileName);

    expect(verifySessionAndGetId).toHaveBeenCalled();
  });

  it('should throw error if tries to upload to foreign bucket', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue('1122');

    await expect(getAvatarUploadUrl(mockUserId, mockFileName)).rejects.toThrow(
      'User is not authorized to upload to this bucket'
    );

    expect(mockCreateSignedUploadUrl).not.toHaveBeenCalled();
  });

  it('should throw error if user is not authorized', async () => {
    (verifySessionAndGetId as jest.Mock).mockImplementation(() => {
      throw new Error('Пользователь не авторизован');
    });

    await expect(getAvatarUploadUrl(mockUserId, mockFileName)).rejects.toThrow(
      'Пользователь не авторизован'
    );

    expect(mockCreateSignedUploadUrl).not.toHaveBeenCalled();
  });

  it('should throw error if file name is empty', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);

    await expect(getAvatarUploadUrl(mockUserId, '')).rejects.toThrow(
      "fileName can't be empty"
    );

    expect(mockCreateSignedUploadUrl).not.toHaveBeenCalled();
  });

  it('should throw error if storage returned error', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockCreateSignedUploadUrl as jest.Mock).mockResolvedValue({
      data: '',
      error: new Error('Some error occurred')
    });

    await expect(getAvatarUploadUrl(mockUserId, mockFileName)).rejects.toThrow(
      'Some error occurred'
    );

    expect(mockCreateSignedUploadUrl).toHaveBeenCalledWith(
      `${mockUserId}/${mockFileName}`,
      { upsert: true }
    );
  });

  it('should return url when storage returns url', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockCreateSignedUploadUrl as jest.Mock).mockResolvedValue({
      data: 'someurl.com/upload',
      error: ''
    });

    const res = await getAvatarUploadUrl(mockUserId, mockFileName);

    expect(res).toBe('someurl.com/upload');

    expect(mockCreateSignedUploadUrl).toHaveBeenCalledWith(
      `${mockUserId}/${mockFileName}`,
      { upsert: true }
    );
  });
});

describe('deleteCurrentAvatar', () => {
  const mockUserId = '11223344';
  const mockListStorageItems = (createClient as jest.Mock)().storage.from()
    .list;
  const mockRemoveStorageItems = (createClient as jest.Mock)().storage.from()
    .remove;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should verify users session', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockListStorageItems as jest.Mock).mockResolvedValue({
      data: [],
      error: ''
    });
    (mockRemoveStorageItems as jest.Mock).mockResolvedValue({
      error: ''
    });

    await deleteCurrentAvatar(mockUserId);

    expect(verifySessionAndGetId).toHaveBeenCalled();
  });

  it('should throw exception when user is not authenticated', async () => {
    (verifySessionAndGetId as jest.Mock).mockImplementation(() => {
      throw new Error('Пользователь не авторизован');
    });

    await expect(deleteCurrentAvatar(mockUserId)).rejects.toThrow(
      'Пользователь не авторизован'
    );

    expect(mockListStorageItems).not.toHaveBeenCalled();
    expect(mockRemoveStorageItems).not.toHaveBeenCalled();
  });

  it('should throw error when try to delete from foreign bucket', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue('1122');

    await expect(deleteCurrentAvatar(mockUserId)).rejects.toThrow(
      "User can't delete from foreign bucket"
    );

    expect(mockListStorageItems).not.toHaveBeenCalled();
    expect(mockRemoveStorageItems).not.toHaveBeenCalled();
  });

  it('should handle undefined data response from list call', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockListStorageItems as jest.Mock).mockResolvedValue({
      data: undefined,
      error: ''
    });

    await deleteCurrentAvatar(mockUserId);

    expect(mockListStorageItems).toHaveBeenCalledWith(mockUserId);
    expect(mockRemoveStorageItems).not.toHaveBeenCalled();
  });

  it("should throw error when storage returns list's error", async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockListStorageItems as jest.Mock).mockResolvedValue({
      data: ['some data'],
      error: new Error('Some error')
    });

    await expect(deleteCurrentAvatar(mockUserId)).rejects.toThrow(Error);

    expect(mockListStorageItems).toHaveBeenCalledWith(mockUserId);
    expect(mockRemoveStorageItems).not.toHaveBeenCalled();
  });

  it("should throw error when storage returns remove's error", async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockListStorageItems as jest.Mock).mockResolvedValue({
      data: ['some data'],
      error: ''
    });
    (mockRemoveStorageItems as jest.Mock).mockResolvedValue({
      error: 'Some error'
    });

    await expect(deleteCurrentAvatar(mockUserId)).rejects.toThrow(Error);

    expect(mockListStorageItems).toHaveBeenCalledWith(mockUserId);
  });

  it('should delete file if input is correct', async () => {
    (verifySessionAndGetId as jest.Mock).mockResolvedValue(mockUserId);
    (mockListStorageItems as jest.Mock).mockResolvedValue({
      data: [{ name: 'fileName' }],
      error: ''
    });
    (mockRemoveStorageItems as jest.Mock).mockResolvedValue({
      error: ''
    });

    await deleteCurrentAvatar(mockUserId);

    expect(mockListStorageItems).toHaveBeenCalledWith(mockUserId);
    expect(mockRemoveStorageItems).toHaveBeenCalledWith([
      `${mockUserId}/fileName`
    ]);
  });
});
