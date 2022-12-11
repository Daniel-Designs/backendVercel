/*
  Warnings:

  - You are about to drop the column `content` on the `transcription` table. All the data in the column will be lost.
  - Added the required column `body` to the `transcription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transcription" DROP COLUMN "content",
ADD COLUMN     "body" VARCHAR(5000) NOT NULL;
