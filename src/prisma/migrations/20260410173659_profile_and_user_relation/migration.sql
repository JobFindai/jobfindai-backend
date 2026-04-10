/*
  Warnings:

  - Added the required column `updatedAt` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "certifications" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "education" JSONB,
ADD COLUMN     "experience" JSONB,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "resumeParsedAt" TIMESTAMP(3),
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "sponsorshipRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "workAuthorization" TEXT,
ADD COLUMN     "yearsOfExperience" INTEGER;
