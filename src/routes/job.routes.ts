import express, { Router } from "express";
import {
  listJobs,
  getJob,
  createJob,
  getMatchedJobs,
} from "../controllers/job.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.use(requireAuth);

router.route("/").get(listJobs).post(createJob);
router.route("/matched").get(getMatchedJobs);
router.route("/:id").get(getJob);

export default router;
