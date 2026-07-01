import { Router } from "express";
import createProject from "../controllers/projects";
import { getAllProjects, getProjectById } from "../controllers/projects";

const router = Router();

router.post("/", createProject);

router.get("/", getAllProjects);

router.get("/:id", getProjectById);

export default router;
