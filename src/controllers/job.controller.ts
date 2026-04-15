import type { Request, Response, NextFunction } from "express";
import { sendSuccess, sendError } from "../utils/response.js";
import * as jobService from "../services/job.service.js";
import HttpError from "../class/error.js";

export async function listJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      jobType,
      remoteType,
      experienceLevel,
      sponsorsVisa,
      location,
      skills,
      page,
      limit,
    } = req.query as Record<string, string | undefined>;

    const result = await jobService.listJobs({
      jobType: jobType as jobService.JobFilters["jobType"],
      remoteType: remoteType as jobService.JobFilters["remoteType"],
      experienceLevel:
        experienceLevel as jobService.JobFilters["experienceLevel"],
      sponsorsVisa:
        sponsorsVisa !== undefined ? sponsorsVisa === "true" : undefined,
      location,
      skills: skills ? skills.split(",").map((s) => s.trim()) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    sendSuccess(res, "Jobs retrieved successfully", result);
  } catch (error) {
    next(error);
  }
}

export async function getJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      sendError(res, "Invalid job ID", 400);
      return;
    }

    const job = await jobService.getJobById(id);
    if (!job) throw new HttpError("Job not found", 404);

    sendSuccess(res, "Job retrieved successfully", job);
  } catch (error) {
    next(error);
  }
}

export async function getMatchedJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    const profile = await import("../services/profile.service.js").then((m) =>
      m.getFullProfile(req.user!.clerkId),
    );

    const results = await jobService.getMatchedJobs(
      req.user,
      profile?.profile ?? null,
    );

    sendSuccess(res, "Matched jobs retrieved successfully", results);
  } catch (error) {
    next(error);
  }
}

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    if (req.user.type !== "ADMIN") {
      sendError(res, "Admin access required", 403);
      return;
    }

    const job = await jobService.createJob({
      ...req.body,
      employerId: req.user.id,
    });

    sendSuccess(res, "Job created successfully", job, 201);
  } catch (error) {
    next(error);
  }
}
