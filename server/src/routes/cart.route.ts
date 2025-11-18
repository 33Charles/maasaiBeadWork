import { Router } from "express";
import { addToCart } from "../controllers/cart.controller";
import { getActiveCart } from "../controllers/cart.controller";

import verifyToken from "../middlewares/verifyToken";


const cartRouter = Router();


cartRouter.post("/add", verifyToken, addToCart )
cartRouter.get("/active",verifyToken, getActiveCart )

export default cartRouter;
