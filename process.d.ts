declare namespace NodeJS {
  export interface ProcessEnv {
    USE_MOCK_USER: string;
    PRISMA_DB_URL: string;
    PRISMA_DIRECT_URL: string;
    NEXT_PUBLIC_USE_MOCK_API: string;
  }
}
