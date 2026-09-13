import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";
import { roleMiddleware } from "../middleware/role.js";
import { createNotification } from "./notifications.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks (support limit=1000 or no limit for Kanban/Gantt)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { projectId, status, assigneeId, page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    
    if (projectId) where.projectId = parseInt(projectId);
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = parseInt(assigneeId);

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: { select: { id: true, name: true } },
          assignee: { select: { id: true, name: true, email: true } },
          subtasks: true,
          worklogs: true,
          attachments: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit)
      }),
      prisma.task.count({ where })
    ]);

    res.json({
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single task
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" }
        },
        subtasks: { orderBy: { createdAt: "asc" } },
        attachments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" }
        },
        worklogs: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task
router.post("/", authMiddleware, roleMiddleware(["PM", "Admin"]), async (req, res) => {
  try {
    const { projectId, title, description, status, priority, assigneeId, startDate, dueDate, progress, estimatedHours } = req.body;
    
    const task = await prisma.task.create({
      data: {
        projectId: parseInt(projectId),
        title,
        description,
        status: status || "To Do",
        priority: priority || "Medium",
        assigneeId: assigneeId ? parseInt(assigneeId) : null,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        progress: progress || 0,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    if (task.assigneeId) {
      await createNotification({
        userId: task.assigneeId,
        title: "New Task Assigned",
        message: `You were assigned to task: "${task.title}"`,
        type: "TASK_ASSIGNED",
        link: `/tasks/${task.id}`
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task (allows Member to update status/progress, or PM/Admin for full update)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, description, status, priority, assigneeId, startDate, dueDate, progress, estimatedHours } = req.body;
    
    const existing = await prisma.task.findUnique({ where: { id: taskId } });
    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        status: status !== undefined ? status : undefined,
        priority: priority !== undefined ? priority : undefined,
        assigneeId: assigneeId !== undefined ? (assigneeId ? parseInt(assigneeId) : null) : undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : undefined,
        progress: progress !== undefined ? progress : undefined,
        estimatedHours: estimatedHours !== undefined ? (estimatedHours ? parseFloat(estimatedHours) : null) : undefined
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    // Notify assignee if newly assigned
    if (assigneeId && parseInt(assigneeId) !== existing.assigneeId) {
      await createNotification({
        userId: parseInt(assigneeId),
        title: "Task Assigned",
        message: `You have been assigned to task: "${task.title}"`,
        type: "TASK_ASSIGNED",
        link: `/tasks/${task.id}`
      });
    }

    // Notify assignee if status changed
    if (status && status !== existing.status && task.assigneeId) {
      await createNotification({
        userId: task.assigneeId,
        title: "Task Status Updated",
        message: `Task "${task.title}" moved to ${status}`,
        type: "STATUS_CHANGED",
        link: `/tasks/${task.id}`
      });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task
router.delete("/:id", authMiddleware, roleMiddleware(["PM", "Admin"]), async (req, res) => {
  try {
    await prisma.task.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
