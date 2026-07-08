import { Router } from "express";
import { getAllUsers, getUserById, updateUser } from "../controllers/users";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.patch("/:id", updateUser);

export default router;
