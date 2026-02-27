import express, { Router } from "express";
import { updateUser } from "../controllers/user.controller";

const router: Router = express.Router();

router.post("/:id", updateUser);

export default router;
