-- DropForeignKey
ALTER TABLE "user_filters" DROP CONSTRAINT "user_filters_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_searches" DROP CONSTRAINT "user_searches_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_searches" ADD CONSTRAINT "user_searches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_filters" ADD CONSTRAINT "user_filters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
