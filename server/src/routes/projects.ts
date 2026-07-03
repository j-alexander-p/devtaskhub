import { Router } from "express";
import createProject, {
  updateProject,
  getAllProjects,
  getProjectById,
} from "../controllers/projects";

const router = Router();

router.post("/", createProject);

router.get("/", getAllProjects);

router.get("/:id", getProjectById);

router.patch("/:id", updateProject);

export default router;
