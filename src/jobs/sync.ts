import { prisma } from "../utils/prisma.js";
import type { JobProvider, JobQuery } from "./providers/types.js";

export async function syncJobs(
  provider: JobProvider,
  query: JobQuery,
): Promise<{ created: number; updated: number; failed: number }> {
  console.log(`[sync] Fetching jobs from provider: ${provider.name}`);

  const jobs = await provider.fetchJobs(query);
  console.log(`[sync] Fetched ${jobs.length} jobs`);

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      const existing = await prisma.job.findUnique({
        where: { externalId: job.externalId },
      });

      await prisma.job.upsert({
        where: { externalId: job.externalId },
        update: {
          title: job.title,
          description: job.description,
          company: job.company,
          location: job.location,
          remoteType: job.remoteType,
          jobType: job.jobType,
          requiredSkills: job.requiredSkills,
          experienceLevel: job.experienceLevel ?? undefined,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          sponsorsVisa: job.sponsorsVisa,
          applyUrl: job.applyUrl,
        },
        create: {
          title: job.title,
          description: job.description,
          company: job.company,
          location: job.location,
          remoteType: job.remoteType,
          jobType: job.jobType,
          requiredSkills: job.requiredSkills,
          experienceLevel: job.experienceLevel ?? undefined,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          sponsorsVisa: job.sponsorsVisa,
          externalId: job.externalId,
          externalSource: job.externalSource,
          applyUrl: job.applyUrl,
        },
      });

      existing ? updated++ : created++;
    } catch (err) {
      console.error(`[sync] Failed to upsert job "${job.title}":`, err);
      failed++;
    }
  }

  console.log(
    `[sync] Done — created: ${created}, updated: ${updated}, failed: ${failed}`,
  );

  return { created, updated, failed };
}
