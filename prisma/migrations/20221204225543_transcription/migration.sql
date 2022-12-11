/*
  Warnings:

  - Added the required column `idauthor` to the `transcription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transcription" ADD COLUMN     "idauthor" INTEGER NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "transcription" ADD CONSTRAINT "fk_transcript_user" FOREIGN KEY ("idauthor") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;
