/*
  Warnings:

  - You are about to drop the `exercisetype` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "fk_exercise_exercisetype";

-- AlterTable
ALTER TABLE "exercise" ADD COLUMN     "skill" VARCHAR(100),
ALTER COLUMN "exercisetype" DROP NOT NULL,
ALTER COLUMN "exercisetype" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "exercisetype";
