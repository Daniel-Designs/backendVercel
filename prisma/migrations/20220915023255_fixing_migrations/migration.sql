/*
  Warnings:

  - You are about to alter the column `levelID` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `VarChar(3)`.
  - You are about to alter the column `skillID` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `VarChar(3)`.
  - You are about to alter the column `typeID` on the `exercise` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `VarChar(3)`.
  - The primary key for the `exerciselevel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idlevel` on the `exerciselevel` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(3)`.
  - The primary key for the `exerciseskill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idskill` on the `exerciseskill` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(3)`.
  - The primary key for the `exercisetype` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idtype` on the `exercisetype` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(3)`.

*/
-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_levelID_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_skillID_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_typeID_fkey";

-- AlterTable
ALTER TABLE "exercise" ALTER COLUMN "levelID" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "skillID" SET DATA TYPE VARCHAR(3),
ALTER COLUMN "typeID" SET DATA TYPE VARCHAR(3);

-- AlterTable
ALTER TABLE "exerciselevel" DROP CONSTRAINT "exerciselevel_pkey",
ALTER COLUMN "idlevel" DROP DEFAULT,
ALTER COLUMN "idlevel" SET DATA TYPE VARCHAR(3),
ADD CONSTRAINT "exerciselevel_pkey" PRIMARY KEY ("idlevel");
DROP SEQUENCE "exerciselevel_idlevel_seq";

-- AlterTable
ALTER TABLE "exerciseskill" DROP CONSTRAINT "exerciseskill_pkey",
ALTER COLUMN "idskill" DROP DEFAULT,
ALTER COLUMN "idskill" SET DATA TYPE VARCHAR(3),
ADD CONSTRAINT "exerciseskill_pkey" PRIMARY KEY ("idskill");
DROP SEQUENCE "exerciseskill_idskill_seq";

-- AlterTable
ALTER TABLE "exercisetype" DROP CONSTRAINT "exercisetype_pkey",
ALTER COLUMN "idtype" DROP DEFAULT,
ALTER COLUMN "idtype" SET DATA TYPE VARCHAR(3),
ADD CONSTRAINT "exercisetype_pkey" PRIMARY KEY ("idtype");
DROP SEQUENCE "exercisetype_idtype_seq";

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "exercisetype"("idtype") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES "exerciseskill"("idskill") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_levelID_fkey" FOREIGN KEY ("levelID") REFERENCES "exerciselevel"("idlevel") ON DELETE NO ACTION ON UPDATE NO ACTION;
