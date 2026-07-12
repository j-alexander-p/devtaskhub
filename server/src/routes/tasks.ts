import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/tasks";

const router = Router();

router.get("/", getAllTasks);

export default router;
