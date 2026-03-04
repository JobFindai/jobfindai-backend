import { getAuth } from "@clerk/express";
import { prisma } from "../utils/prisma";
export async function getUser(req, res) {
    try {
        console.log("GET USER CONTROLLER HIT");
        const { isAuthenticated, userId } = getAuth(req);
        if (!isAuthenticated) {
            return res
                .status(401)
                .json({ status: "error", message: "User not authenticated" });
        }
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });
        if (!user) {
            return res
                .status(404)
                .json({ status: "error", message: "User not found" });
        }
        return res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: user,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
}
export async function updateUser(req, res) {
    console.log(req.headers.authorization);
    // Check if user is authenticated to perform this action
    const { isAuthenticated, userId } = getAuth(req);
    if (!isAuthenticated) {
        return res.status(401).json({ error: "User not authenticated" });
    }
    // Check if user has been created
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    // Update user
    await prisma.user.update({
        where: { clerkId: userId },
        data: {
            currentLevel: req.body.currentLevel,
            targetLevel: req.body.targetLevel,
            type: req.body.type,
            onboardingStatus: "COMPLETED",
        },
    });
    return res.status(200).json({
        success: "User updated successfully",
    });
}
//# sourceMappingURL=user.controller.js.map