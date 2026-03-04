/*
  Warnings:

  - Added the required column `onboardingStatus` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboardingStatus" "Status" NOT NULL;
