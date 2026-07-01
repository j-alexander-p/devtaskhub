import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import db from "../db";
import { RegisterBody, LoginBody } from "../types/auth";
import jwt from "jsonwebtoken";
import config from "../config";

// note: ' .. ' means "out of this folder one level"

// *******************************************  REGISTRATION *******************************************
export async function registerUser(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
) {
  //destructure
  const { username, email, password } = req.body;

  //validate
  const errors = [];

  if (!username || username.trim() === "") {
    errors.push("Need valid input");
  }

  if (!email || email.trim() === "") {
    errors.push("Need valid input");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: errors.join(", "),
    });
  }

  // try/catch - hash
  try {
    const hashedPw = await bcrypt.hash(password, 10);

    // db query
    const result = await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [username, email, hashedPw], //this is "parameter binding"
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Insert failed!" });
    }

    // response
    res.status(201).json({
      message: "User registered successfully!",
      userId: user.id,
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "User already exists." });
    }

    next(err);
  }
}

// ******************************************* USER LOGIN *******************************************

export async function loginUser(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
) {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Invalid. Try again.");
  }

  if (!password) {
    errors.push("Invalid. Try again.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors });
  }

  try {
    const result = await db.query(
      "SELECT username, email, password_hash, id FROM users WHERE email = $1",
      [email],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid. Try again." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid. Try again." });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          email: user.email,
          id: user.id,
        },
      });
  } catch (err: any) {
    next(err);
  }
}
