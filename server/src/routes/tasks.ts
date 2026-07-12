import { Router } from "express";
import { createTask, getAllTasks, getTaskById } from "../controllers/tasks";

const router = Router();

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

export default router;
