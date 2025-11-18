import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Assuming your auth middleware adds user
    const { productId, quantity } = req.body;
    console.log(req.body)
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // 1. Find user's ACTIVE cart + include items
    let cart = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { items: true },
    });

    // 2. If no active cart → create new
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          status: "ACTIVE",
        },
        include: { items: true },
      });
    }

    
    if (!cart) {
      return res.status(500).json({ message: "Cart creation failed" });
    }

    // 4. Check if product is already in cart
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (quantity || 1),
        },
      });

      return res.status(200).json({
        message: "Cart updated successfully",
        cartItem: updatedItem,
      });
    }

    // 5. Add new product to cart
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: quantity || 1,
      },
    });

    return res.status(200).json({
      message: "Product added to cart",
      cartItem: newItem,
    });

  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};


export const getActiveCart = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No cart items",
        cart: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    console.error("Error fetching active cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};
