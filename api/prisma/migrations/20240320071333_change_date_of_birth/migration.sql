/*
  Warnings:

  - You are about to drop the column `birthDate` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "birthDate",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);
