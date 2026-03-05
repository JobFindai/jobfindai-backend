import express, { Router } from "express";
import { getUser, updateUser } from "../controllers/user.controller.js";
const router = express.Router();
router.route("/").get(getUser).patch(updateUser);
export default router;
//# sourceMappingURL=user.routes.js.map