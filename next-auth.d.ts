import { DefaultSession } from 'next-auth';

// this process is know as module augmentation
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      image: string;
      username: string;
      email: string;
    } & DefaultSession['user'];
  }
}
