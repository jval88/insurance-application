/*
  Warnings:

  - The `relationship` column on the `Member` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('Spouse', 'Sibling', 'Parent', 'Friend', 'Other');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_memberId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "memberId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "relationship",
ADD COLUMN     "relationship" "RelationshipType";

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
