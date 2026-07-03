import { Router } from "express";
import createProject, {
  updateProject,
  getAllProjects,
  getProjectById,
  deleteProject,
} from "../controllers/projects";

const router = Router();

router.post("/", createProject);

router.get("/", getAllProjects);

router.get("/:id", getProjectById);

router.patch("/:id", updateProject);

router.delete("/:id", deleteProject);

export default router;
