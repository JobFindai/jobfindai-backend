/*
  Warnings:

  - The values [JOB_SEEKER,EMPLOYER] on the enum `UserType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'LEAD_MANAGER');

-- AlterEnum
BEGIN;
CREATE TYPE "UserType_new" AS ENUM ('STUDENT', 'EARLY_CAREER', 'MID_CAREER', 'EXPERIENCED_PROFESSIONAL', 'CAREER_SWITCHER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "type" TYPE "UserType_new" USING ("type"::text::"UserType_new");
ALTER TYPE "UserType" RENAME TO "UserType_old";
ALTER TYPE "UserType_new" RENAME TO "UserType";
DROP TYPE "public"."UserType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentLevel" "Level",
ADD COLUMN     "targetLevel" "Level";
