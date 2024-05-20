/*
  Warnings:

  - Added the required column `Function` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "Function" TEXT NOT NULL;
