-- CreateEnum
CREATE TYPE "SocialMedia" AS ENUM ('Telegram', 'Instagram');

-- CreateTable
CREATE TABLE "UserSearch" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blogger" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "photo_link" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "niche" TEXT NOT NULL,
    "social_media" "SocialMedia" NOT NULL,

    CONSTRAINT "Blogger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSearch" ADD CONSTRAINT "UserSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
