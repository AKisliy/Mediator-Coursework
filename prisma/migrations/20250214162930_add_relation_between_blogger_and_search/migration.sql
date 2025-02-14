/*
  Warnings:

  - The primary key for the `Blogger` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Blogger" DROP CONSTRAINT "Blogger_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Blogger_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "BloggerInSearch" (
    "bloggerId" TEXT NOT NULL,
    "searchId" UUID NOT NULL,

    CONSTRAINT "BloggerInSearch_pkey" PRIMARY KEY ("bloggerId","searchId")
);

-- AddForeignKey
ALTER TABLE "BloggerInSearch" ADD CONSTRAINT "BloggerInSearch_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "UserSearch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloggerInSearch" ADD CONSTRAINT "BloggerInSearch_bloggerId_fkey" FOREIGN KEY ("bloggerId") REFERENCES "Blogger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
