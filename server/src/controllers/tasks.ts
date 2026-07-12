import { Request, Response, NextFunction } from "express";
import db from "../db";
import { CreateTaskBody } from "../types/tasks";
import { UrlParams } from "../types/common";
import { Url } from "node:url";

export async function createTask(
  req: Request<UrlParams, {}, CreateTaskBody>,
  res: Response,
  next: NextFunction,
) {
  const { title, description, assigned_to } = req.body;
  const { userId } = req;
  const projectId = parseInt(req.params.id);

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Needs a title." });
  }

  try {
    const projectCheck = await db.query(
      "SELECT * FROM projects WHERE id = $1",
      [projectId],
    );

    const project = projectCheck.rows[0];

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const result = await db.query(
      "INSERT INTO tasks (title, description, created_by,project_id, assigned_to) VALUES ($1, $2, $3, $4, $5) RETURNING id, project_id, created_by, assigned_to",
      [title, description, userId, projectId, assigned_to],
    );

    const task = result.rows[0];

    if (!task) {
      return res.status(500).json({
        error: "Failed to create task.",
      });
    }

    res.status(201).json({
      message: "Task created successfully.",
      taskId: task.id,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function getAllTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { userId } = req;

  try {
    const result = await db.query(
      `SELECT * FROM tasks WHERE assigned_to = $1`,
      [userId],
    );

    const tasks = result.rows;

    res.status(200).json({
      message: "Tasks retrieved successfully.",
      tasks,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function getTaskById(
  req: Request<UrlParams>,
  res: Response,
  next: NextFunction,
) {
  const taskId = parseInt(req.params.id);

  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1 ", [
      taskId,
    ]);

    const task = result.rows[0];

    if (!task) {
      return res.status(404).json({
        error: "Not found.",
      });
    }

    res.status(200).json({
      message: "Task found.",
      task,
    });
  } catch (err: any) {
    next(err);
  }
}
