import { z } from "zod";

export const updateOnboardingSchema = z.object({
  currentLevel: z.enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "LEAD_MANAGER"]),
  targetLevel: z.enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR_LEVEL", "LEAD_MANAGER"]),
  type: z.enum([
    "STUDENT",
    "EARLY_CAREER",
    "MID_CAREER",
    "EXPERIENCED_PROFESSIONAL",
    "CAREER_SWITCHER",
    "ADMIN",
  ]),
});

export const updateProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
  linkedinUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  workAuthorization: z.string().max(100).optional(),
  sponsorshipRequired: z.boolean().optional(),
});
