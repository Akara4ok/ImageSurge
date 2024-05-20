/*
  Warnings:

  - Added the required column `StatusCode` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Time` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "StatusCode" INTEGER NOT NULL,
ADD COLUMN     "Time" TIMESTAMP(3) NOT NULL;
