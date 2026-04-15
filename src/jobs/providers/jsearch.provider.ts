import type {
  JobProvider,
  JobQuery,
  NormalizedJob,
  RemoteType,
  JobType,
  ExperienceLevel,
} from "./types.js";

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_description: string;
  job_city: string | null;
  job_state: string | null;
  job_country: string | null;
  job_is_remote: boolean;
  job_employment_type: string | null;
  job_required_skills: string[] | null;
  job_required_experience: {
    no_experience_required: boolean;
    required_experience_in_months: number | null;
  } | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_apply_link: string | null;
  job_visa_sponsorship: boolean | null;
}

interface JSearchResponse {
  data: JSearchJob[];
}

function mapEmploymentType(type: string | null): JobType {
  if (!type) return "FULL_TIME";
  const t = type.toUpperCase();
  if (t.includes("PART")) return "PART_TIME";
  if (t.includes("CONTRACT") || t.includes("CONTRACTOR")) return "CONTRACT";
  if (t.includes("INTERN")) return "INTERNSHIP";
  return "FULL_TIME";
}

function mapExperienceLevel(
  months: number | null,
  noExperience: boolean,
): ExperienceLevel | null {
  if (noExperience || months === 0) return "ENTRY_LEVEL";
  if (months === null) return null;
  if (months <= 24) return "ENTRY_LEVEL";
  if (months <= 60) return "MID_LEVEL";
  if (months <= 108) return "SENIOR_LEVEL";
  return "LEAD_MANAGER";
}

function buildLocation(job: JSearchJob): string | null {
  const parts = [job.job_city, job.job_state, job.job_country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function normalize(job: JSearchJob): NormalizedJob {
  const remoteType: RemoteType = job.job_is_remote ? "REMOTE" : "ON_SITE";
  const expMonths =
    job.job_required_experience?.required_experience_in_months ?? null;
  const noExp = job.job_required_experience?.no_experience_required ?? false;

  return {
    title: job.job_title,
    description: job.job_description,
    company: job.employer_name,
    location: buildLocation(job),
    remoteType,
    jobType: mapEmploymentType(job.job_employment_type),
    requiredSkills: job.job_required_skills ?? [],
    experienceLevel: mapExperienceLevel(expMonths, noExp),
    salaryMin: job.job_min_salary ?? null,
    salaryMax: job.job_max_salary ?? null,
    sponsorsVisa: job.job_visa_sponsorship ?? false,
    externalId: `jsearch_${job.job_id}`,
    externalSource: "jsearch",
    applyUrl: job.job_apply_link ?? null,
  };
}

export class JSearchProvider implements JobProvider {
  readonly name = "jsearch";

  private readonly apiKey: string;
  private readonly baseUrl =
    "https://jsearch.p.rapidapi.com/search";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchJobs(query: JobQuery): Promise<NormalizedJob[]> {
    const keyword = query.keywords.join(" ");
    const params = new URLSearchParams({
      query: keyword,
      num_pages: "1",
      page: "1",
      date_posted: "month",
    });

    if (query.remoteType === "REMOTE") {
      params.set("remote_jobs_only", "true");
    }

    if (query.location) {
      params.set("query", `${keyword} in ${query.location}`);
    }

    const url = `${this.baseUrl}?${params.toString()}`;

    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": this.apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!res.ok) {
      throw new Error(
        `JSearch API error: ${res.status} ${res.statusText}`,
      );
    }

    const json = (await res.json()) as JSearchResponse;
    const jobs = json.data ?? [];
    const limit = query.limit ?? jobs.length;

    return jobs.slice(0, limit).map(normalize);
  }
}
