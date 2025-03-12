/*
  Warnings:

  - You are about to drop the `Blogger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSearch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSearch" DROP CONSTRAINT "UserSearch_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BloggerToUserSearch" DROP CONSTRAINT "_BloggerToUserSearch_A_fkey";

-- DropForeignKey
ALTER TABLE "_BloggerToUserSearch" DROP CONSTRAINT "_BloggerToUserSearch_B_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_planId_fkey";

-- DropTable
DROP TABLE "Blogger";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "UserSearch";

-- CreateTable
CREATE TABLE "plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "monthly_limit" INTEGER NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_searches" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "query" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloggers" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image_link" TEXT,
    "followers_count" INTEGER NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "social_media" "social_media" NOT NULL,

    CONSTRAINT "bloggers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_searches" ADD CONSTRAINT "user_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BloggerToUserSearch" ADD CONSTRAINT "_BloggerToUserSearch_A_fkey" FOREIGN KEY ("A") REFERENCES "bloggers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BloggerToUserSearch" ADD CONSTRAINT "_BloggerToUserSearch_B_fkey" FOREIGN KEY ("B") REFERENCES "user_searches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
