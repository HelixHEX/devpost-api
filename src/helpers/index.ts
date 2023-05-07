import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateToken = (user: User) => {
  return jwt.sign({ user }, process.env.TOKEN_SECRET!);
};

export { generateToken, prisma };
