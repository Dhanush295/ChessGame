/*
  Warnings:

  - You are about to drop the `Sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sessions" DROP CONSTRAINT "Sessions_authorId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accountCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Sessions";
