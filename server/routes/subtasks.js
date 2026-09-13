import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Helper to recalculate and update Task progress based on subtasks
async function updateTaskProgress(taskId) {
  const subtasks = await prisma.subtask.findMany({
    where: { taskId: Number(taskId) },
  });

  if (subtasks.length === 0) {
    return;
  }

  const completedCount = subtasks.filter((st) => st.isCompleted).length;
  const progress = Math.round((completedCount / subtasks.length) * 100);

  await prisma.task.update({
    where: { id: Number(taskId) },
    data: { progress },
  });
}

// GET all subtasks for a task
router.get("/task/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const subtasks = await prisma.subtask.findMany({
      where: { taskId: Number(taskId) },
      orderBy: { createdAt: "asc" },
    });
    res.json(subtasks);
  } catch (error) {
    console.error("Fetch subtasks error:", error);
    res.status(500).json({ message: "Failed to fetch subtasks" });
  }
});

// POST create a subtask
router.post("/task/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Subtask title is required" });
    }

    const subtask = await prisma.subtask.create({
      data: {
        taskId: Number(taskId),
        title: title.trim(),
      },
    });

    await updateTaskProgress(taskId);

    res.status(201).json(subtask);
  } catch (error) {
    console.error("Create subtask error:", error);
    res.status(500).json({ message: "Failed to create subtask" });
  }
});

// PATCH toggle subtask completed status
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.subtask.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    const updated = await prisma.subtask.update({
      where: { id: Number(id) },
      data: { isCompleted: !existing.isCompleted },
    });

    await updateTaskProgress(existing.taskId);

    res.json(updated);
  } catch (error) {
    console.error("Toggle subtask error:", error);
    res.status(500).json({ message: "Failed to update subtask" });
  }
});

// DELETE subtask
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.subtask.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Subtask not found" });
    }

    await prisma.subtask.delete({
      where: { id: Number(id) },
    });

    await updateTaskProgress(existing.taskId);

    res.json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Delete subtask error:", error);
    res.status(500).json({ message: "Failed to delete subtask" });
  }
});

export default router;
