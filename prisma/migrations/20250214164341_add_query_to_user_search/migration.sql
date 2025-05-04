/*
  Warnings:

  - You are about to drop the `BloggerInSearch` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `social_media` on the `Blogger` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `query` to the `UserSearch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "social_media" AS ENUM ('Telegram', 'Instagram');

-- DropForeignKey
ALTER TABLE "BloggerInSearch" DROP CONSTRAINT "BloggerInSearch_bloggerId_fkey";

-- DropForeignKey
ALTER TABLE "BloggerInSearch" DROP CONSTRAINT "BloggerInSearch_searchId_fkey";

-- AlterTable
ALTER TABLE "Blogger" DROP COLUMN "social_media",
ADD COLUMN     "social_media" "social_media" NOT NULL;

-- AlterTable
ALTER TABLE "UserSearch" ADD COLUMN     "query" TEXT NOT NULL;

-- DropTable
DROP TABLE "BloggerInSearch";

-- DropEnum
DROP TYPE "SocialMedia";

-- CreateTable
CREATE TABLE "_BloggerToUserSearch" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_BloggerToUserSearch_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BloggerToUserSearch_B_index" ON "_BloggerToUserSearch"("B");

-- AddForeignKey
ALTER TABLE "_BloggerToUserSearch" ADD CONSTRAINT "_BloggerToUserSearch_A_fkey" FOREIGN KEY ("A") REFERENCES "Blogger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BloggerToUserSearch" ADD CONSTRAINT "_BloggerToUserSearch_B_fkey" FOREIGN KEY ("B") REFERENCES "UserSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
