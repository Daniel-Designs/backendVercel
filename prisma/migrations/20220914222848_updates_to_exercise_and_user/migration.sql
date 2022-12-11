/*
  Warnings:

  - You are about to drop the column `createdby` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exercisetype` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `exlevel` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `skill` on the `exercise` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `exercise` table. All the data in the column will be lost.
  - You are about to alter the column `desctopic` on the `exercisetopic` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `statedesc` on the `state` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(15)`.
  - You are about to drop the column `sex` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `sex` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `levelID` to the `exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skillID` to the `exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeID` to the `exercise` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `exercise` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "fk_exercise_admins";

-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "fk_exercise_exercisetopic";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "fk_user_sex";

-- AlterTable
ALTER TABLE "exercise" DROP COLUMN "createdby",
DROP COLUMN "exercisetype",
DROP COLUMN "exlevel",
DROP COLUMN "skill",
DROP COLUMN "topic",
ADD COLUMN     "levelID" SMALLINT NOT NULL,
ADD COLUMN     "skillID" SMALLINT NOT NULL,
ADD COLUMN     "typeID" SMALLINT NOT NULL,
ALTER COLUMN "exstate" SET DEFAULT 'active',
ALTER COLUMN "exstate" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "exercisetopic" RENAME CONSTRAINT "pk_exercisetopic_idtopic" TO "exercisetopic_pkey";
ALTER TABLE "exercisetopic" ALTER COLUMN "desctopic" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "favorites" ALTER COLUMN "datec" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "message" ALTER COLUMN "timestmp" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "state" ALTER COLUMN "statedesc" SET DATA TYPE VARCHAR(15);

-- AlterTable
ALTER TABLE "transcription" ALTER COLUMN "content" SET DATA TYPE VARCHAR(1000);

-- AlterTable
ALTER TABLE "user" DROP COLUMN "sex";

-- AlterTable
ALTER TABLE "userexercises" ALTER COLUMN "rdate" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "sex";

-- CreateTable
CREATE TABLE "exercisetype" (
    "idtype" SERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,

    CONSTRAINT "exercisetype_pkey" PRIMARY KEY ("idtype")
);

-- CreateTable
CREATE TABLE "exerciseskill" (
    "idskill" SERIAL NOT NULL,
    "skill" VARCHAR(30) NOT NULL,

    CONSTRAINT "exerciseskill_pkey" PRIMARY KEY ("idskill")
);

-- CreateTable
CREATE TABLE "exerciselevel" (
    "idlevel" SERIAL NOT NULL,
    "level" VARCHAR(30) NOT NULL,

    CONSTRAINT "exerciselevel_pkey" PRIMARY KEY ("idlevel")
);

-- CreateTable
CREATE TABLE "_adminsToexercise" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_exerciseToexercisetopic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_adminsToexercise_AB_unique" ON "_adminsToexercise"("A", "B");

-- CreateIndex
CREATE INDEX "_adminsToexercise_B_index" ON "_adminsToexercise"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_exerciseToexercisetopic_AB_unique" ON "_exerciseToexercisetopic"("A", "B");

-- CreateIndex
CREATE INDEX "_exerciseToexercisetopic_B_index" ON "_exerciseToexercisetopic"("B");

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "exercisetype"("idtype") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_skillID_fkey" FOREIGN KEY ("skillID") REFERENCES "exerciseskill"("idskill") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_levelID_fkey" FOREIGN KEY ("levelID") REFERENCES "exerciselevel"("idlevel") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_adminsToexercise" ADD CONSTRAINT "_adminsToexercise_A_fkey" FOREIGN KEY ("A") REFERENCES "admins"("idadmin") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_adminsToexercise" ADD CONSTRAINT "_adminsToexercise_B_fkey" FOREIGN KEY ("B") REFERENCES "exercise"("idexercise") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_exerciseToexercisetopic" ADD CONSTRAINT "_exerciseToexercisetopic_A_fkey" FOREIGN KEY ("A") REFERENCES "exercise"("idexercise") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_exerciseToexercisetopic" ADD CONSTRAINT "_exerciseToexercisetopic_B_fkey" FOREIGN KEY ("B") REFERENCES "exercisetopic"("idtopic") ON DELETE CASCADE ON UPDATE CASCADE;
