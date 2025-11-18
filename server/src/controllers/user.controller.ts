import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const updateUserInfo = async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const { firstName, lastName, username, email, profileImageUrl, phone, address } = req.body;

  try {
    const userDetails: any = {};

    if (firstName && firstName !== "") {
      userDetails.firstName = firstName;
    }

    if (lastName && lastName !== "") {
      userDetails.lastName = lastName;
    }

    if (username && username !== "") {
      userDetails.username = username;
    }

    if (email && email !== "") {
      userDetails.email = email;
    }
    if (profileImageUrl && profileImageUrl !== "") {
      userDetails.profileImageUrl = profileImageUrl;
    }
    if (phone && phone !== "") {
      userDetails.phoneNo = phone
    }
    if (address && address !== ""){
      userDetails.location = address
    }

    const updatedUserInfo = await client.user.update({
      where: { id },
      data: userDetails,
    });
    res.status(200).json({
      message: "Profile infomation updated successfully.", user: updatedUserInfo
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

