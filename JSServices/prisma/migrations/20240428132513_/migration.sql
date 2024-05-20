/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[UrlSuffix]` on the table `KServeUrl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Name]` on the table `Model` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Status` to the `Dataset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dataset" ADD COLUMN     "Status" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_Name_key" ON "Category"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "KServeUrl_UrlSuffix_key" ON "KServeUrl"("UrlSuffix");

-- CreateIndex
CREATE UNIQUE INDEX "Model_Name_key" ON "Model"("Name");
