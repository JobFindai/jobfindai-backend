import type { Job, User, Profile } from "@prisma/client";

const WEIGHTS = {
  skills: 0.5,
  level: 0.25,
  visa: 0.15,
  remote: 0.1,
};

export interface FitScoreBreakdown {
  total: number;        // 0–100
  skills: number;       // 0–100
  level: number;        // 0–100
  visa: number;         // 0–100
  remote: number;       // 0–100
}

export interface ScoredJob {
  job: Job;
  fitScore: FitScoreBreakdown;
}

const LEVEL_ORDER: Record<string, number> = {
  ENTRY_LEVEL: 1,
  MID_LEVEL: 2,
  SENIOR_LEVEL: 3,
  LEAD_MANAGER: 4,
};

function scoreSkills(
  profileSkills: string[],
  requiredSkills: string[],
): number {
  if (!requiredSkills.length) return 100;
  if (!profileSkills.length) return 0;

  const normalizedProfile = profileSkills.map((s) => s.toLowerCase().trim());
  const matched = requiredSkills.filter((req) =>
    normalizedProfile.some(
      (ps) => ps.includes(req.toLowerCase()) || req.toLowerCase().includes(ps),
    ),
  );

  return Math.round((matched.length / requiredSkills.length) * 100);
}

function scoreLevel(
  userLevel: string | null,
  jobLevel: string | null,
): number {
  if (!jobLevel || !userLevel) return 100;

  const userRank = LEVEL_ORDER[userLevel] ?? 0;
  const jobRank = LEVEL_ORDER[jobLevel] ?? 0;
  const diff = userRank - jobRank;

  if (diff >= 0) return 100;           // meets or exceeds requirement
  if (diff === -1) return 60;          // one level below
  return 20;                           // two or more levels below
}

function scoreVisa(
  workAuth: string | null,
  sponsorshipRequired: boolean,
  jobSponsors: boolean,
): number {
  // User needs sponsorship but job doesn't offer it
  if (sponsorshipRequired && !jobSponsors) return 0;
  // User has authorization or job sponsors
  return 100;
}

function scoreRemote(
  userLocation: string | null,
  jobRemoteType: string,
  jobLocation: string | null,
): number {
  if (jobRemoteType === "REMOTE") return 100;
  if (!userLocation || !jobLocation) return 80;

  const userCity = userLocation.toLowerCase();
  const jobCity = jobLocation.toLowerCase();

  if (userCity.includes(jobCity) || jobCity.includes(userCity)) return 100;
  return 60;
}

export function computeFitScore(
  user: User,
  profile: Profile | null,
  job: Job,
): FitScoreBreakdown {
  const skills = scoreSkills(profile?.skills ?? [], job.requiredSkills);
  const level = scoreLevel(user.currentLevel, job.experienceLevel);
  const visa = scoreVisa(
    profile?.workAuthorization ?? null,
    profile?.sponsorshipRequired ?? false,
    job.sponsorsVisa,
  );
  const remote = scoreRemote(
    profile?.location ?? null,
    job.remoteType,
    job.location,
  );

  const total = Math.round(
    skills * WEIGHTS.skills +
      level * WEIGHTS.level +
      visa * WEIGHTS.visa +
      remote * WEIGHTS.remote,
  );

  return { total, skills, level, visa, remote };
}

export function rankJobs(
  user: User,
  profile: Profile | null,
  jobs: Job[],
): ScoredJob[] {
  return jobs
    .map((job) => ({ job, fitScore: computeFitScore(user, profile, job) }))
    .sort((a, b) => b.fitScore.total - a.fitScore.total);
}
