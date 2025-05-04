-- CreateTable
CREATE TABLE "user_filters" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "filters" JSONB NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_filters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_filters" ADD CONSTRAINT "user_filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
