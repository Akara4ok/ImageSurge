/*
  Warnings:

  - Made the column `Level` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "Level" SET NOT NULL,
ALTER COLUMN "Level" SET DEFAULT 15;
