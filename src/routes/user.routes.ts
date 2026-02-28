import express, { Router } from "express";
import { updateUser } from "../controllers/user.controller";

const router: Router = express.Router();

router.patch("/", updateUser);

export default router;
