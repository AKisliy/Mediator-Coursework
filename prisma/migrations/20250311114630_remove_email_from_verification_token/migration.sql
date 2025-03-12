/*
  Warnings:

  - You are about to drop the column `email` on the `verification_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "verification_tokens" DROP COLUMN "email";
