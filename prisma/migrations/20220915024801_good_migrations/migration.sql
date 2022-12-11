/*
  Warnings:

  - You are about to alter the column `levelID` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3)` to `Char`.
  - You are about to alter the column `skillID` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3)` to `Char`.

*/
-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_levelID_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_skillID_fkey";

-- AlterTable
ALTER TABLE "exercise" ALTER COLUMN "levelID" SET DATA TYPE CHAR,
ALTER COLUMN "skillID" SET DATA TYPE CHAR;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES "exerciseskill"("idskill") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_levelID_fkey" FOREIGN KEY ("levelID") REFERENCES "exerciselevel"("idlevel") ON DELETE NO ACTION ON UPDATE NO ACTION;
