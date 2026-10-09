import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/product.routes";
import cartRouter from "./routes/cart.route";


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }),
);


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sever up and listening on port ${port}`);
});