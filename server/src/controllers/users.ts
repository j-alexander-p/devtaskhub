import { Request, Response, NextFunction } from "express";
import db from "../db";
import { UrlParams } from "../types/common";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await db.query(`
      SELECT username, role FROM users
    `);

    res.status(200).json({
      message: "Fetched users successfully.",
      users: result.rows,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function getUserById(
  req: Request<UrlParams>,
  res: Response,
  next: NextFunction,
) {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query(
      `
      SELECT username, role FROM users WHERE id = $1
    `,
      [id],
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User found.",
      user,
    });
  } catch (err: any) {
    next(err);
  }
}
