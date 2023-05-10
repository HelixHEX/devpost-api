import express from "express";
import type { Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { prisma } from "../helpers";

const router = express.Router();

router.get("/feed", authenticate, async (req: Request, res: Response) => {
  try {
    const feed = await prisma.changelog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.json({ success: true, feed });
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

router.post("/new", authenticate, async (req: Request, res: Response) => {
  try {
    const { projectName, title, body } = req.body;

    const project = await prisma.project.findUnique({
      where: {
        name: projectName,
      },
    });

    if (!project) {
      return res.json({ success: false, message: "Project not found" });
    }

    const changelog = await prisma.changelog.create({
      data: {
        title,
        body,
        project: {
          connect: {
            name: projectName,
          },
        },
      },
    });

    return res.json({ success: true, changelog });
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

export default router;
