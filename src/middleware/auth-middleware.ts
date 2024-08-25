import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "GoKapture@123";

import dataSource from "../datasource/datasource";
import { User } from "../entities/User-entity";

let userRepo = dataSource.getRepository(User);

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const userIdNumber = decoded.userId;

    const user = await userRepo.findOne({ where: { id: userIdNumber } });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
