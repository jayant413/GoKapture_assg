import { Request, Response, NextFunction } from "express";

export const AuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
