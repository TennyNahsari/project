import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Configure uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// GET attachments for task
router.get("/task/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const attachments = await prisma.attachment.findMany({
      where: { taskId: Number(taskId) },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(attachments);
  } catch (error) {
    console.error("Fetch attachments error:", error);
    res.status(500).json({ message: "Failed to fetch attachments" });
  }
});

// POST upload attachment
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { taskId, projectId } = req.body;

    const attachment = await prisma.attachment.create({
      data: {
        taskId: taskId ? Number(taskId) : null,
        projectId: projectId ? Number(projectId) : null,
        userId: req.userId,
        filename: req.file.originalname,
        filepath: `/uploads/${req.file.filename}`,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(attachment);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

// DELETE attachment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await prisma.attachment.findUnique({
      where: { id: Number(id) },
    });

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    // Try deleting physical file
    const physicalPath = path.join(process.cwd(), attachment.filepath);
    if (fs.existsSync(physicalPath)) {
      try {
        fs.unlinkSync(physicalPath);
      } catch (err) {
        console.warn("Could not delete physical file:", err);
      }
    }

    await prisma.attachment.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Attachment deleted" });
  } catch (error) {
    console.error("Delete attachment error:", error);
    res.status(500).json({ message: "Failed to delete attachment" });
  }
});

export default router;
