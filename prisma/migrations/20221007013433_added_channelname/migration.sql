/*
  Warnings:

  - Added the required column `channelname` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chat" ADD COLUMN     "channelname" VARCHAR(164) NOT NULL;
