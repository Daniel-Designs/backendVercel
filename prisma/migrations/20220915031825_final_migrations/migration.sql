/*
  Warnings:

  - The primary key for the `exerciselevel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idlevel` on the `exerciselevel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3)` to `Char`.
  - The primary key for the `exerciseskill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `idskill` on the `exerciseskill` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3)` to `Char`.
  - You are about to drop the `_exerciseToexercisetopic` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_exerciseToexercisetopic" DROP CONSTRAINT "_exerciseToexercisetopic_A_fkey";

-- DropForeignKey
ALTER TABLE "_exerciseToexercisetopic" DROP CONSTRAINT "_exerciseToexercisetopic_B_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_levelID_fkey";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_skillID_fkey";

-- AlterTable
ALTER TABLE "exercise" ADD COLUMN     "topicID" SMALLINT,
ALTER COLUMN "levelID" SET DATA TYPE CHAR,
ALTER COLUMN "skillID" SET DATA TYPE CHAR;

-- AlterTable
ALTER TABLE "exerciselevel" DROP CONSTRAINT "exerciselevel_pkey",
ALTER COLUMN "idlevel" SET DATA TYPE CHAR,
ADD CONSTRAINT "exerciselevel_pkey" PRIMARY KEY ("idlevel");

-- AlterTable
ALTER TABLE "exerciseskill" DROP CONSTRAINT "exerciseskill_pkey",
ALTER COLUMN "idskill" SET DATA TYPE CHAR,
ADD CONSTRAINT "exerciseskill_pkey" PRIMARY KEY ("idskill");

-- DropTable
DROP TABLE "_exerciseToexercisetopic";

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES "exerciseskill"("idskill") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_levelID_fkey" FOREIGN KEY ("levelID") REFERENCES "exerciselevel"("idlevel") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_topicID_fkey" FOREIGN KEY ("topicID") REFERENCES "exercisetopic"("idtopic") ON DELETE NO ACTION ON UPDATE NO ACTION;
