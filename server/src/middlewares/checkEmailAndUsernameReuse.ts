import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

const checkEmailUsernameReuse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, username } = req.body;
  try {
    const emailExists = await client.user.findFirst({
      where: { email },
    });
    if (emailExists) {
      res.status(400).json({ message: "Email already in use." });
      return;
    }
    const usernameExists = await client.user.findFirst({
      where: {
        username,
      },
    });
    if (usernameExists) {
      res.status(400).json({ message: "Username already in use." });
      return;
    }
    next();
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export default checkEmailUsernameReuse;