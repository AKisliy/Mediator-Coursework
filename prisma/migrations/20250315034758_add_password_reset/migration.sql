-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_identifier_token_key" ON "password_reset_tokens"("identifier", "token");
