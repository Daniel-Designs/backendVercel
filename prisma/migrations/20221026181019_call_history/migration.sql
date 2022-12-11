/*
  Warnings:

  - You are about to drop the column `idcaller` on the `calls` table. All the data in the column will be lost.
  - Added the required column `idcalled` to the `calls` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "calls" DROP CONSTRAINT "fk_calls_user";

-- AlterTable
ALTER TABLE "calls" DROP COLUMN "idcaller",
ADD COLUMN     "idcalled" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "calls" ADD CONSTRAINT "fk_calls_user" FOREIGN KEY ("idcalled") REFERENCES "user"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION;
