import { Router } from "express";
import { getAllTasks, getTaskById, updateTask } from "../controllers/tasks";

const router = Router();

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.patch("/:id", updateTask);

export default router;
