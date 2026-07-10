import { Router } from "express";
import createProject, {
  updateProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from "../controllers/projects";

const router = Router();

router.post("/", createProject);

router.get("/", getAllProjects);

router.get("/:id", getProjectById);

router.patch("/:id", updateProject);

router.delete("/:id", deleteProject);

router.post("/:id/members", addProjectMember);

router.delete("/:id/members/:memberId", removeProjectMember);

export default router;
