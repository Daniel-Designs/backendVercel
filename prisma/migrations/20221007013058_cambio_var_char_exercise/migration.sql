-- DropForeignKey
ALTER TABLE "exercise" DROP CONSTRAINT "exercise_typeID_fkey";

-- AlterTable
ALTER TABLE "exercise" ALTER COLUMN "typeID" SET DATA TYPE VARCHAR(5);

-- AddForeignKey
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_typeID_fkey" FOREIGN KEY ("typeID") REFERENCES "exercisetype"("idtype") ON DELETE NO ACTION ON UPDATE NO ACTION;
