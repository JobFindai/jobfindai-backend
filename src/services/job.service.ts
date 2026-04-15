import { prisma } from "../utils/prisma.js";
import type { JobType, RemoteType, Level, User, Profile } from "@prisma/client";
import { rankJobs } from "../jobs/fitscore.js";

export interface JobFilters {
  jobType?: JobType;
  remoteType?: RemoteType;
  experienceLevel?: Level;
  sponsorsVisa?: boolean;
  location?: string;
  skills?: string[];
  page?: number;
  limit?: number;
}

export async function listJobs(filters: JobFilters = {}) {
  const {
    jobType,
    remoteType,
    experienceLevel,
    sponsorsVisa,
    location,
    skills,
    page = 1,
    limit = 20,
  } = filters;

  const where: Parameters<typeof prisma.job.findMany>[0]["where"] = {};

  if (jobType) where.jobType = jobType;
  if (remoteType) where.remoteType = remoteType;
  if (experienceLevel) where.experienceLevel = experienceLevel;
  if (sponsorsVisa !== undefined) where.sponsorsVisa = sponsorsVisa;
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (skills?.length) {
    where.requiredSkills = { hasSome: skills };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  return { jobs, total, page, limit };
}

export async function getJobById(id: number) {
  return prisma.job.findUnique({ where: { id } });
}

export async function getMatchedJobs(user: User, profile: Profile | null) {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });
  return rankJobs(user, profile, jobs);
}

export async function createJob(data: {
  title: string;
  description: string;
  company?: string;
  location?: string;
  remoteType?: RemoteType;
  jobType?: JobType;
  requiredSkills?: string[];
  experienceLevel?: Level;
  salaryMin?: number;
  salaryMax?: number;
  sponsorsVisa?: boolean;
  applyUrl?: string;
  employerId: number;
}) {
  return prisma.job.create({ data });
}
