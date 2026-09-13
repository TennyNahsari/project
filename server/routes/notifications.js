import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Helper to create notification internally
export async function createNotification({ userId, title, message, type = "INFO", link = null }) {
  if (!userId) return null;
  try {
    return await prisma.notification.create({
      data: {
        userId: Number(userId),
        title,
        message,
        type,
        link,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

// GET notifications for current user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// PATCH mark notification as read
router.patch("/:id/read", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.updateMany({
      where: {
        id: Number(id),
        userId: req.userId,
      },
      data: { isRead: true },
    });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

// PATCH mark all notifications as read
router.patch("/read-all", authMiddleware, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: {
        userId: req.userId,
        isRead: false,
      },
      data: { isRead: true },
    });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Failed to update notifications" });
  }
});

export default router;
