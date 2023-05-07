import jwt from "jsonwebtoken";
import { JsonWebTokenError } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../helpers";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decode = jwt.verify(
        token,
        process.env.TOKEN_SECRET || "secret"
      ) as JwtPayload;
      let user = await prisma.user.findUnique({
        where: { id: decode.user.id },
        select: {
          id: true,
          username: true,
          email: true,
          profile: true,
          profileId: true,
        }
      });
      if (!user) {
        return res.json({ success: false, message: "Unauthorized" });
      }

      req.user = user;
      next();
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        if (err.name === "JsonWebTokenError") {
          return res.json({ success: false, message: "Unauthorized" });
        }
        if (err.name === "TokenExpiredError") {
          return res.json({
            success: false,
            message: "sesson expired try sign in!",
          });
        }

        res.json({ success: false, message: "Internal server error!" });
      }
    }
  } else {
    res.json({ success: false, message: "Unauthorized" });
  }
};

export { authenticate };
