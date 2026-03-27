import type { Request, Response, NextFunction } from "express";
import { sendSuccess, sendError } from "../utils/response.js";
import * as profileService from "../services/profile.service.js";
import { parsePDF } from "../utils/cv-parser.js";
import HttpError from "../class/error.js";

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    const profile = await profileService.getFullProfile(req.user.clerkId);
    sendSuccess(res, "Profile retrieved successfully", profile);
  } catch (error) {
    next(error);
  }
}

export async function updateOnboarding(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    const updated = await profileService.updateOnboarding(req.user.clerkId, req.body);
    sendSuccess(res, "Onboarding completed successfully", updated);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    const profile = await profileService.updateProfileFields(req.user.id, req.body);
    sendSuccess(res, "Profile updated successfully", profile);
  } catch (error) {
    next(error);
  }
}

export async function uploadResume(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    if (!req.file) {
      sendError(res, "No file uploaded. Send a PDF with field name 'cv'", 400);
      return;
    }

    const parsed = await parsePDF(req.file.buffer);

    const saveData: Parameters<typeof profileService.saveResumeData>[2] = {
      skills: parsed.parsed.skills,
      experience: parsed.parsed.experience,
      education: parsed.parsed.education,
      certifications: parsed.parsed.certifications,
      languages: parsed.parsed.languages,
    };
    if (parsed.parsed.yearsOfExperience !== null) {
      saveData.yearsOfExperience = parsed.parsed.yearsOfExperience;
    }
    if (parsed.parsed.summary !== null) {
      saveData.aiSummary = parsed.parsed.summary;
    }
    const profile = await profileService.saveResumeData(req.user.id, null, saveData);

    sendSuccess(res, "CV parsed successfully", {
      rawText: parsed.rawText,
      parsed: parsed.parsed,
      profile,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteResume(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new HttpError("User not found", 404);

    const profile = await profileService.clearResume(req.user.id);
    sendSuccess(res, "Resume removed successfully", profile);
  } catch (error) {
    next(error);
  }
}
