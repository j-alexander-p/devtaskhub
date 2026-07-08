import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/users";

const router = Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
