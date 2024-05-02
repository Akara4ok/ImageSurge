/*
  Warnings:

  - You are about to drop the column `ClassifiactionTime` on the `Request` table. All the data in the column will be lost.
  - Added the required column `ClassificationTime` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" DROP COLUMN "ClassifiactionTime",
ADD COLUMN     "ClassificationTime" DOUBLE PRECISION NOT NULL;
