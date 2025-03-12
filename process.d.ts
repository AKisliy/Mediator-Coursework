declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_USE_MOCK_USER: string;
    PRISMA_DB_URL: string;
    PRISMA_DIRECT_URL: string;
    USE_MOCK_API: string;
    BOT_TOKEN: string;
    NEXT_PUBLIC_BOT_USERNAME: string;
    REDIS_URL: string;
    EMAIL_FROM: string;
    EMAIL_SERVER_HOST: string;
    EMAIL_SERVER_USER: string;
    EMAIL_SERVER_PASSWORD: string;
    EMAIL_SERVER_PORT: number;
  }
}
