/*
  Warnings:

  - Added the required column `title` to the `exercise` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `exbody` on the `exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "exercise" ADD COLUMN     "title" VARCHAR(100) NOT NULL,
DROP COLUMN "exbody",
ADD COLUMN     "exbody" JSONB NOT NULL;
