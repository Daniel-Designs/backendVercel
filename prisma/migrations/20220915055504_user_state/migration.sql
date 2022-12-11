/*
  Warnings:

  - The primary key for the `exerciselevel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `exerciseskill` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_levelID_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_skillID_fkey";

-- AlterTable
ALTER TABLE "exercise" ALTER COLUMN "levelID" SET DATA TYPE CHAR,
ALTER COLUMN "skillID" SET DATA TYPE CHAR;

-- AlterTable
ALTER TABLE "exerciselevel" DROP CONSTRAINT "exerciselevel_pkey",
ALTER COLUMN "idlevel" SET DATA TYPE CHAR,
ADD CONSTRAINT "exerciselevel_pkey" PRIMARY KEY ("idlevel");

-- AlterTable
ALTER TABLE "exerciseskill" DROP CONSTRAINT "exerciseskill_pkey",
ALTER COLUMN "idskill" SET DATA TYPE CHAR,
ADD CONSTRAINT "exerciseskill_pkey" PRIMARY KEY ("idskill");

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES "exerciseskill"("idskill") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_levelID_fkey" FOREIGN KEY ("levelID") REFERENCES "exerciselevel"("idlevel") ON DELETE NO ACTION ON UPDATE NO ACTION;
