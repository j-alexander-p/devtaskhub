import { Request, Response, NextFunction } from "express";
import db from "../db";
import {
  CreateProjectBody,
  UrlParams,
  UpdateProjectBody,
} from "../types/projects";
import { userInfo } from "node:os";

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

export async function getAllProjects(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req;

  try {
    const result = await db.query(
      `
      SELECT DISTINCT p.*
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id
      WHERE p.created_by = $1 OR pm.user_id = $1
      `,
      [userId],
    );

    res.status(200).json({
      message: "Projects retrieved successfully.",
      projects: result.rows,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function getProjectById(
  req: Request<UrlParams>,
  res: Response,
  next: NextFunction,
) {
  const projectId = parseInt(req.params.id);

  try {
    const result = await db.query("SELECT * FROM projects WHERE id = $1", [
      projectId,
    ]);

    const project = result.rows[0];

    if (!project) {
      return res.status(404).json({ error: "Fetching failed." });
    }

    res.status(200).json({
      message: "Retrieved successfully.",
      project: project,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function updateProject(
  req: Request<UrlParams, {}, UpdateProjectBody>,
  res: Response,
  next: NextFunction,
) {
  const { status } = req.body;
  const id = parseInt(req.params.id);
  const { userId } = req;

  if (!status) {
    return res.status(400).json({ error: "Needs valid fields." });
  }

  if (!id) {
    return res.status(400).json({ error: "Needs valid fields." });
  }

  try {
    const projectCreator = await db.query(
      "SELECT * FROM projects WHERE created_by = $1 AND id = $2",
      [userId, id],
    );

    const loggedInCreator = projectCreator.rows[0];

    if (!loggedInCreator) {
      return res.status(403).json({ error: "Denied." });
    }

    const result = await db.query(
      "UPDATE projects SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );

    res.status(200).json({
      message: "Updated succesffully.",
      project: result.rows[0],
    });
  } catch (err: any) {
    next(err);
  }
}
