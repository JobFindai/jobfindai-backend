export type RemoteType = "REMOTE" | "HYBRID" | "ON_SITE";
export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type ExperienceLevel =
  | "ENTRY_LEVEL"
  | "MID_LEVEL"
  | "SENIOR_LEVEL"
  | "LEAD_MANAGER";

export interface JobQuery {
  keywords: string[];
  location?: string;
  remoteType?: RemoteType;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  limit?: number;
}

export interface NormalizedJob {
  title: string;
  description: string;
  company: string;
  location: string | null;
  remoteType: RemoteType;
  jobType: JobType;
  requiredSkills: string[];
  experienceLevel: ExperienceLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  sponsorsVisa: boolean;
  externalId: string;
  externalSource: string;
  applyUrl: string | null;
}

export interface JobProvider {
  readonly name: string;
  fetchJobs(query: JobQuery): Promise<NormalizedJob[]>;
}
