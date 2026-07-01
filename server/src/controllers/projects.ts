import { Request, Response, NextFunction } from "express";
import db from "../db";
import { CreateProjectBody } from "../types/projects";

export default async function createProject(
  req: Request<{}, {}, CreateProjectBody>,
  res: Response,
  next: NextFunction,
) {
  const { project_name } = req.body;
  const { userId } = req;

  const errors = [];

  if (!project_name || project_name.trim() === "") {
    errors.push("Needs a valid name");
  }

  if (errors.length > 0) {
    return errors.join("");
  }

  try {
    const result = await db.query(
      "INSERT INTO projects (project_name, created_by) VALUES ($1, $2) RETURNING id",
      [project_name, userId],
    );

    const projectId = result.rows[0]?.id;

    if (!projectId) {
      return res.status(500).json({ error: "Insert failed!" });
    }

    res.status(201).json({
      message: "Project created successfully.",
      projectId: projectId,
    });
  } catch (err: any) {
    next(err);
  }
}
