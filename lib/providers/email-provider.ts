import EmailProvider, {
  NodemailerUserConfig
} from 'next-auth/providers/nodemailer';

export const nodemailerConfig = {
  server: {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  },
  from: process.env.EMAIL_FROM
} satisfies NodemailerUserConfig;

export const emailProvider = EmailProvider(nodemailerConfig);
