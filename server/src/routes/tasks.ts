import { Router } from "express";
import {
  deleteTask,
  getAllTasks,
  getTaskById,
  reassignTask,
  updateTask,
} from "../controllers/tasks";
import { enhancerController } from "../services/controllers/ai";

const router = Router();

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.patch("/:id", updateTask);

router.delete("/:id", deleteTask);

router.patch("/:id/assign", reassignTask);

router.post("/:id/enhance", enhancerController);

export default router;
