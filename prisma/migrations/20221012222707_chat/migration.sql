/*
  Warnings:

  - A unique constraint covering the columns `[usero,usert]` on the table `chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chat_usero_usert_key" ON "chat"("usero", "usert");
