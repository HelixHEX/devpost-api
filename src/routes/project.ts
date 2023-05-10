import express from "express";
import { prisma } from "../helpers";
import { authenticate } from "../middleware/auth";
import type { Request, Response } from "express";

const router = express.Router();

router.get(
  "/profile/:id",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let projects;
      if (id === "me") {
        projects = await prisma.project.findMany({
          where: {
            profileId: req.user!.profileId,
          },
        });
      } else {
        projects = await prisma.project.findMany({
          where: {
            profileId: Number(id),
          },
        });
      }
      return res.json({ success: true, projects });
    } catch (err) {
      if (err instanceof Error) {
        return res.json({ success: false, message: err.message });
      } else {
        return res.json({ success: false, message: "Internal server error" });
      }
    }
  }
);

router.post("/new", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        profile: {
          connect: {
            id: req.user!.profileId,
          },
        },
      },
    });

    return res.json({ success: true, project });
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

export default router;
