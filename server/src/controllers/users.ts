import { Request, Response, NextFunction } from "express";
import db from "../db";
import { UrlParams } from "../types/common";
import { UpdateUserBody } from "../types/users";

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

export async function updateUser(
  req: Request<UrlParams, {}, UpdateUserBody>,
  res: Response,
  next: NextFunction,
) {
  const { username, email, role } = req.body;
  const id = parseInt(req.params.id);
  const userId = req.userId;

  try {
    const existing = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    const user = existing.rows[0];

    if (!user) {
      return res.status(404).json({
        error: "Server error",
      });
    }

    if (user.id !== userId) {
      return res.status(403).json({
        error: "Not your profile.",
      });
    }

    const newUsername = username ?? user.username;
    const newEmail = email ?? user.email;
    const newRole = role ?? user.role;

    const update = await db.query(
      `
      UPDATE users SET username  = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, username, role
      `,
      [newUsername, newEmail, newRole, id],
    );

    res.status(200).json({
      message: "Update successful.",
      user: update.rows[0],
    });
  } catch (err: any) {
    next(err);
  }
}

export async function deleteUser(
  req: Request<UrlParams>,
  res: Response,
  next: NextFunction,
) {
  const userId = req.userId;
  const id = parseInt(req.params.id);

  if (id !== userId) {
    return res.status(403).json({ error: "Invalid id match." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);

    const goingToDelete = result.rows[0];

    if (!goingToDelete) {
      return res.status(404).json({ error: "Not found." });
    }

    const deleted = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );

    res.status(200).json({
      message: "User deleted.",
      deletedId: deleted.rows[0].id,
    });
  } catch (err: any) {
    next(err);
  }
}
