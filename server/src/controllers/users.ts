import { Request, Response, NextFunction } from "express";
import db from "../db";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await db.query(`
      SELECT id, username, role FROM users
    `);

    res.status(200).json({
      message: "Fetched users successfully.",
      users: result.rows,
    });
  } catch (err: any) {
    next(err);
  }
}
