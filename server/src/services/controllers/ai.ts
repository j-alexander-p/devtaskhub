import { Request, Response, NextFunction } from "express";
import db from "../../db";
import { enhanceTaskDescription } from "../ai";
import { UrlParams } from "../../types/common";
import OpenAI from "openai";

export async function enhancerController(
  req: Request<UrlParams>,
  res: Response,
  next: NextFunction,
) {
  const taskId = parseInt(req.params.id);

  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [
      taskId,
    ]);

    const task = result.rows[0];

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    const description = task.description;

    if (!description || description.trim() === "") {
      return res
        .status(502)
        .json({ error: "Cannot enhance an empty description." });
    }

    const enhancedDesc = await enhanceTaskDescription(task.description);

    res.status(200).json({
      message: "Description enhanced.",
      enhancedDesc,
    });
  } catch (err: any) {
    next(err);
  }
}
