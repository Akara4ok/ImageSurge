/*
  Warnings:

  - You are about to drop the `KServeUrl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KServeUrl" DROP CONSTRAINT "KServeUrl_CategoryId_fkey";

-- DropForeignKey
ALTER TABLE "KServeUrl" DROP CONSTRAINT "KServeUrl_ModelId_fkey";

-- DropTable
DROP TABLE "KServeUrl";
