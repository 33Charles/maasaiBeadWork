import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserPayload } from "../types";

// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const token = req.cookies.access_token;
 

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. Please login." });
//   }

//   jwt.verify(
//     token,
//     process.env.JWT_SECRET!,
//     (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
//       if (error) {
//         res.status(401).json({ message: "Unauthorized. Invalid token." });
//         return;
//       }
//       req.user = decoded as UserPayload;
//       next();
//     },
//   );
// };



const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. Please login." });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (error) {
        res.status(401).json({ message: "Unauthorized. Invalid token." });
        return;
      }
      req.user = decoded as UserPayload;
      next();
    },
  );
};

export default verifyToken;