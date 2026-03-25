import express, { Router } from "express";
import { createUser } from "../controllers/webhook.controller.js";

const router: Router = express.Router();

router.route("/clerk/user.created").post(createUser);

export default router;
