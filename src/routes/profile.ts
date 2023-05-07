import express from "express";
import type { Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import { prisma } from "../helpers";

const router = express.Router();

router.get("/me", authenticate, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        profileId: true,
      },
    });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    } else {
      return res.json({ success: true, user });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

router.get("/id/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await prisma.profile.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!profile) {
      return res.json({ success: false, message: "Profile not found" });
    } else {
      return res.json({ success: true, profile });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

export default router;
