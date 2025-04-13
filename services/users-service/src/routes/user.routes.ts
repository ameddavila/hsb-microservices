import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  assignRole,
} from "@/controllers/user.controller";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkRole } from "@/middlewares/checkRole";

const router = Router();

// Protegidas solo para admin
router.post("/", authenticateToken, checkRole(["admin"]), createUser);
router.get("/", authenticateToken, checkRole(["admin"]), getAllUsers);
router.get("/:id", getUserById);
router.post("/assign-role", authenticateToken, checkRole(["admin"]), assignRole);

export default router;
