import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
} from "@/controllers/role.controller";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkRole } from "@/middlewares/checkRole";

const router = Router();

router.post("/", authenticateToken, checkRole(["Administrador"]), createRole);
router.get("/", authenticateToken, checkRole(["Administrador"]), getAllRoles);
router.get("/:id", authenticateToken, checkRole(["Administrador"]), getRoleById);

export default router;
