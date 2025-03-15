/*
  Warnings:

  - You are about to drop the column `planPurchase` on the `user_searches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_searches" DROP COLUMN "planPurchase";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "planPurchase" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
