/*
  Warnings:

  - A unique constraint covering the columns `[channelname]` on the table `chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "chat_channelname_key" ON "chat"("channelname");
