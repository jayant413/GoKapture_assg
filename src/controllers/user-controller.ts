import { Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "GoKapture@123";

import { User } from "../entities/User-entity";
import dataSource from "../datasource/datasource";
import { hashPassword, comparePassword } from "../helpers/authHelper";

let userRepo = dataSource.getRepository(User);

/* Register User */
export const RegisterUser = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body;

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      return res.status(500).json({ message: "Error hashing password" });
    }

    const user = new User();
    user.username = username;
    user.password = hashedPassword;
    user.role = role;

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

    const user = await userRepo.findOneBy({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res.status(500).json({
      message: "Error while logging in",
      error: error,
    });
  }
};
