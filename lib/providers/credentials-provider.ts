import { getUserByEmail } from '@/app/actions/user.action';
import { LoginSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';

export const credentialsProvider = Credentials({
  async authorize(credentials) {
    const validatedCredentials = LoginSchema.safeParse(credentials);

    if (!validatedCredentials.success) {
      return null;
    }

    const { email, password } = validatedCredentials.data;

    const user = await getUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      return user;
    }

    return null;
  }
});
