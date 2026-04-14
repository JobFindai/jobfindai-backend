import type { UserModel } from "../../generated/prisma/models.js";
// import type { Level, UserType } from "../../generated/prisma/enums.js";
import type { Level, UserType } from "@prisma/client";
import { prisma } from "../utils/prisma.js";

// --- User + Profile (combined) ---
export async function findUserByClerkId(
  clerkId: string,
): Promise<UserModel | null> {
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function getFullProfile(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { profile: true },
  });
  return user;
}

export async function updateOnboarding(
  clerkId: string,
  data: { currentLevel: Level; targetLevel: Level; type: UserType },
) {
  console.log("[updateOnboarding] called with:", { clerkId, data });
  const updated = await prisma.user.update({
    where: { clerkId },
    data: {
      currentLevel: data.currentLevel,
      targetLevel: data.targetLevel,
      type: data.type,
      onboardingStatus: "COMPLETED",
    },
    include: { profile: true },
  });
  console.log("[updateOnboarding] success:", updated.id);
  return updated;
}

export async function updateProfileFields(
  userId: number,
  data: {
    bio?: string;
    location?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    githubUrl?: string;
    workAuthorization?: string;
    sponsorshipRequired?: boolean;
  },
) {
  return prisma.profile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
}

// --- Resume ---

export async function saveResumeData(
  userId: number,
  resumeUrl: string | null,
  parsedData: {
    skills?: string[];
    experience?: object;
    education?: object;
    certifications?: string[];
    languages?: string[];
    yearsOfExperience?: number;
    aiSummary?: string;
  },
) {
  const payload = {
    resumeUrl,
    resumeParsedAt: new Date(),
    ...parsedData,
  };

  return prisma.profile.upsert({
    where: { userId },
    update: payload,
    create: { userId, ...payload },
  });
}

export async function clearResume(userId: number) {
  // Cast needed until prisma generate runs after schema migration
  const data = {
    resumeUrl: null,
    skills: [],
    experience: null,
    education: null,
    certifications: [],
    languages: [],
    yearsOfExperience: null,
    aiSummary: null,
    resumeParsedAt: null,
  } as Parameters<typeof prisma.profile.update>[0]["data"];

  return prisma.profile.update({ where: { userId }, data });
}

// --- Webhook helpers ---

export async function createUserFromWebhook(data: {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}): Promise<UserModel> {
  return prisma.user.create({ data: { ...data, onboardingStatus: "PENDING" } });
}

export async function deleteUserByClerkId(clerkId: string): Promise<void> {
  await prisma.user.delete({ where: { clerkId } });
}
