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

router.put("/update", authenticate, async (req: Request, res: Response) => {
  try {
    const { name, bio, pronouns, email, username } = req.body;
    const profile = await prisma.profile.update({
      where: {
        id: req.user!.profileId,
      },
      data: {
        name,
        bio,
        pronouns,
      },
    });
    const checkUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (checkUsername && checkUsername.id !== req.user!.id) {
      return res.json({success: false, message: "Username already taken"});
    }

    const checkEmail  = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (checkEmail && checkEmail.id !== req.user!.id) {
      return res.json({success: false, message: "Email already taken"});
    }

    const user = await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        email,
        username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        profileId: true,
      }
    });

    if (!profile) {
      return res.json({ success: false, message: "Profile not found" });
    }
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, profile, user });
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

export default router;
