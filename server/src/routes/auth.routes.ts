import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateUserPassword,
  logoutUser,
  getUserInfo,
} from "../controllers/auth.controller";
import checkEmailUsernameReuse from "../middlewares/checkEmailAndUsernameReuse";
import  verifyToken  from "../middlewares/verifyToken";

const authRouter = Router();

authRouter.post("/register", checkEmailUsernameReuse, registerUser);
authRouter.post("/login", loginUser);
authRouter.patch("/change-password", verifyToken, updateUserPassword);
authRouter.post("/logout", verifyToken, logoutUser);
authRouter.get("/me", verifyToken, getUserInfo);

export default authRouter;