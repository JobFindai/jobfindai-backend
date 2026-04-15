import express, { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.use(requireAuth);

router.route("/").get(dashboard);

export default router;
