import express, { Router } from "express";
import {
  getProfile,
  updateOnboarding,
  updateProfile,
  uploadResume,
  deleteResume,
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  updateOnboardingSchema,
  updateProfileSchema,
} from "../validators/profile.validator.js";
import { uploadResume as uploadMiddleware } from "../middleware/upload.middleware.js";

const router: Router = express.Router();

router.use(requireAuth);

router.route("/").get(getProfile);
router
  .route("/onboarding")
  .patch(validate(updateOnboardingSchema), updateOnboarding);
router.route("/details").patch(validate(updateProfileSchema), updateProfile);
router
  .route("/resume")
  .post(uploadMiddleware, uploadResume)
  .delete(deleteResume);

export default router;
