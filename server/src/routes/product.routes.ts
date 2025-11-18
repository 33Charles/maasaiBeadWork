import { Router } from "express";
import { createProduct } from "../controllers/product.controller";
import { getProducts } from "../controllers/product.controller";
import { getProductById } from "../controllers/product.controller";
import { upload } from "../middlewares/upload";
import verifyToken from "../middlewares/verifyToken";


const productRouter = Router();


productRouter.post("/createProduct", verifyToken, upload.array("images", 6),createProduct);
productRouter.get("/", verifyToken, getProducts )
productRouter.get("/:id",verifyToken, getProductById)

export default productRouter;
