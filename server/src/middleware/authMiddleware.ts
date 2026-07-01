import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;

  try {
    const validToken = jwt.verify(token, config.jwtSecret) as {
      userId: number;
    };

    req.userId = validToken.userId;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid access." });
  }
}

export default authMiddleware;
