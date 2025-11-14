import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password } = req.body;
  console.log(req.body)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const _newUser = await client.user.create({
      data: { firstName, lastName, email, username, password: hashedPassword },
    });
    res.status(201).json({
      message: "Account created successfully.",
    });
  } catch (_e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password} = req.body;
  console.log(req.body)
  try {
    const user = await client.user.findFirst({
      where: {
        AND: [
          {
            OR: [{ email: identifier }, { username: identifier }],
          },
          {
            isDeleted: false,
          },
        ],
      },
    });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }
    const isSimilar = await bcrypt.compare(password, user.password!);
    if (!isSimilar) {
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }
    const {
      password: userPassword,
      lastUpdated,
      ...userInfo
    } = user;
    const token = jwt.sign(userInfo, process.env.JWT_SECRET!);
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 3000,
    });

    res.status(200).json({ userInfo });
  } catch (_e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  console.log(req.user)

  try {
    const user = await client.user.findFirst({
      where: { id },
    });
    if (user) {
      const {
        password: userPassword,
        lastUpdated,
        createdAt,
        ...userInfo
      } = user;
    
      res.status(200).json({ userInfo });
    }
  } catch {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await client.user.findFirst({
      where: { id },
    });
    if (!user) {
      res.status(401).json({ message: "Unauthorized. Please login" });
      return;
    }
    const isSimilar = await bcrypt.compare(currentPassword, user.password!);

    if (!isSimilar) {
      res
        .status(400)
        .json({ message: "You entered a wrong current password." });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "Password changed successfully." });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed.", error });
  }
};
