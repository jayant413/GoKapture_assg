import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "../entities/User-entity";
import dataSource from "../datasource/datasource";
import { hashPassword, comparePassword } from "../helpers/authHelper";

const JWT_SECRET = process.env.JWT_SECRET || "GoKapture@123";

let userRepo = dataSource.getRepository(User);

/* Register User */
export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    const user = new User();
    user.username = username;
    user.password = hashedPassword;

    res.status(201).json(await userRepo.save(user));
  } catch (error) {
    res.status(500).json({
      message: "Error while user registration",
      error: error,
    });
  }
};

/* Login User */
export const LoginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await userRepo.findOneBy({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Error while logging in",
      error: error,
    });
  }
};
