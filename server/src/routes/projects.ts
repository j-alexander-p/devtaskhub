import { Router } from "express";
import createProject from "../controllers/projects";
import { getAllProjects } from "../controllers/projects";

const router = Router();

router.post("/", createProject);

router.get("/", getAllProjects);

export default router;
