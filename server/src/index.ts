import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
//import userRouter from "./routes/user.routes";



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }),
);


app.use("/api/auth", authRouter);
//app.use("/api/user", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sever up and listening on port ${port}`);
});