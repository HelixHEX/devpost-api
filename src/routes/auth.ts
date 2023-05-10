import type { Request, Response } from "express";
import express from "express";
import { generateToken, prisma } from "../helpers";
import bcrypt from "bcrypt";
import { authenticate } from "../middleware/auth";

const router = express.Router();

const saltRounds = 10;

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name, bio, username, birthdate, pronouns } =
    req.body;
  try {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const user = await prisma.user.create({
        data: {
          username: username.toLowerCase(),
          email,
          password: hash,
          profile: {
            create: {
              name,
              bio,
              pronouns,
            },
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
          profile: true,
          profileId: true,
        },
      });
      if (!user) {
        return res.json({ success: false, message: "User not created" });
      } else {
        const token = generateToken(user);
        return res.json({ success: true, user, token });
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email, username }],
      },
      include: {
        profile: true,
      },
    });
    console.log(user)
    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect username/password",
      });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.json({ success: false, message: err.message });
        }
        if (result) {
          const { password, createdAt, updatedAt, ...otherUser } = user;
          const token = generateToken(otherUser);
          return res.json({ success: true, otherUser, token });
        } else {
          return res.json({
            success: false,
            message: "Incorrect username/password",
          });
        }
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

router.get("/check/email/:email", async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.json({ success: true, message: "Email not in use" });
    } else {
      return res.json({ success: false, message: "Email already in use" });
    }
  } catch (err) {
    if (err instanceof Error) {
      return res.json({ success: false, message: err.message });
    } else {
      return res.json({ success: false, message: "Internal server error" });
    }
  }
});

//check username route
router.get("/check/username/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ success: true, message: "Username not in use" });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Username already in use" });
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
