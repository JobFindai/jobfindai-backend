import express, { Router } from "express";
import { signUp } from "../controllers/user.controller";

const router: Router = express.Router();

router.post("/signup", signUp);

export default router;
