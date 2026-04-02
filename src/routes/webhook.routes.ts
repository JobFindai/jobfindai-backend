import express, { Router } from "express";
import {
  createUser,
  validateWebhook,
} from "../controllers/webhook.controller.js";

const router: Router = express.Router();

// validate webhook != verify webhook - this needs to run first
router.use(express.raw({ type: "application/json" }), validateWebhook);

router.route("/clerk/user.created").post(createUser);

export default router;
