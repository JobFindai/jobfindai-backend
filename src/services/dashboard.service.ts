import type { User, Profile } from "@prisma/client";
import { prisma } from "../utils/prisma.js";
import { computeFitScore, rankJobs } from "../jobs/fitscore.js";

export async function getDashboard(user: User, profile: Profile | null) {
  const [total, inReview, interviews, applications, allJobs] =
    await Promise.all([
      prisma.application.count({
        where: { applicantId: user.id },
      }),
      prisma.application.count({
        where: { applicantId: user.id, status: "REVIEWED" },
      }),
      prisma.application.count({
        where: { applicantId: user.id, status: "INTERVIEW" },
      }),
      prisma.application.findMany({
        where: { applicantId: user.id },
        include: { job: true },
      }),
      prisma.job.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

  // Average FitScore across all roles the user has applied to
  const appliedScores = applications.map((app) =>
    computeFitScore(user, profile, app.job),
  );
  const avgFitScore =
    appliedScores.length
      ? Math.round(
          appliedScores.reduce((sum, s) => sum + s.total, 0) /
            appliedScores.length,
        )
      : null;

  // Top 5 recommended jobs ranked by FitScore
  const ranked = rankJobs(user, profile, allJobs);
  const topRecommended = ranked.slice(0, 5);

  return {
    stats: {
      totalApplied: total,
      inReview,
      interviews,
      avgFitScore,
    },
    recommendedJobs: topRecommended,
  };
}
