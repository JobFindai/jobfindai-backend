import express, { Router } from "express";
import { getUser, updateUser } from "../controllers/user.controller";

const router: Router = express.Router();

router.route("/").get(getUser).patch(updateUser);

export default router;
