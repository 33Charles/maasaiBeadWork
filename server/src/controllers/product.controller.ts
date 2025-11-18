import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.user as { id: string };

    const { title, price, description, category } = req.body;

    // Multer images are in req.files
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0)
      return res.status(400).json({ message: "Please upload at least 1 image" });

    const imageUrls = files.map((file) => `/uploads/${file.filename}`);

    const product = await prisma.product.create({
      data: {
        title,
        price: parseFloat(price),
        description,
        category,
        userId,

        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform response to match frontend structure
    const formatted = products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
      images: p.images.map((img) => img.url),
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Failed to load products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product", error);
    res.status(500).json({ message: "Server error" });
  }
};

