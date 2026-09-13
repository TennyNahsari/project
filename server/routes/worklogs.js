import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// GET worklogs for task
router.get("/task/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const worklogs = await prisma.worklog.findMany({
      where: { taskId: Number(taskId) },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(worklogs);
  } catch (error) {
    console.error("Fetch worklogs error:", error);
    res.status(500).json({ message: "Failed to fetch worklogs" });
  }
});

// POST add worklog entry
router.post("/task/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { hours, description } = req.body;

    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) {
      return res.status(400).json({ message: "Please provide a valid duration in hours" });
    }

    const worklog = await prisma.worklog.create({
      data: {
        taskId: Number(taskId),
        userId: req.userId,
        hours: parsedHours,
        description: description ? description.trim() : null,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(worklog);
  } catch (error) {
    console.error("Create worklog error:", error);
    res.status(500).json({ message: "Failed to log work hours" });
  }
});

// DELETE worklog entry
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const worklog = await prisma.worklog.findUnique({
      where: { id: Number(id) },
    });

    if (!worklog) {
      return res.status(404).json({ message: "Worklog entry not found" });
    }

    // Only creator or admin/PM can delete
    const currentUser = await prisma.user.findUnique({ where: { id: req.userId } });
    if (worklog.userId !== req.userId && currentUser?.role !== "Admin" && currentUser?.role !== "PM") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.worklog.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Worklog entry deleted" });
  } catch (error) {
    console.error("Delete worklog error:", error);
    res.status(500).json({ message: "Failed to delete worklog" });
  }
});

export default router;
