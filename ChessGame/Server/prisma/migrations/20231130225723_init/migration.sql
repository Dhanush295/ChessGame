/*
  Warnings:

  - You are about to drop the column `userAgent` on the `Sessions` table. All the data in the column will be lost.
  - You are about to drop the column `vail` on the `Sessions` table. All the data in the column will be lost.
  - Added the required column `vaild` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "userAgent",
DROP COLUMN "vail",
ADD COLUMN     "vaild" BOOLEAN NOT NULL;
