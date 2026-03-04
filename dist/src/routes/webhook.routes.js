import express, { Router } from "express";
import { createUser, validateWebhook } from "../controllers/webhook.controller";
const router = express.Router();
// Verify webhook signature to make sure it is from clerk
// We need raw body for signature verification.
// So we use express.raw() middleware.
router.use(express.raw({ type: "application/json" }), validateWebhook);
router.route("/clerk/user.created").post(createUser);
export default router;
//# sourceMappingURL=webhook.routes.js.map