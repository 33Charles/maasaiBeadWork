import { Router } from "express";
import { updateUserInfo} from "../controllers/user.controller";
import verifyToken  from "../middlewares/verifyToken";

const userRouter = Router();
userRouter.patch("/profile", verifyToken, updateUserInfo);

export default userRouter;