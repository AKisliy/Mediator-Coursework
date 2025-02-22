/*
  Warnings:

  - You are about to drop the column `followers` on the `Blogger` table. All the data in the column will be lost.
  - You are about to drop the column `niche` on the `Blogger` table. All the data in the column will be lost.
  - You are about to drop the column `photo_link` on the `Blogger` table. All the data in the column will be lost.
  - Added the required column `category` to the `Blogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Blogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followers_count` to the `Blogger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_link` to the `Blogger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blogger" DROP COLUMN "followers",
DROP COLUMN "niche",
DROP COLUMN "photo_link",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "followers_count" INTEGER NOT NULL,
ADD COLUMN     "image_link" TEXT NOT NULL;
