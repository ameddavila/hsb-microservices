import { Router } from "express";
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
} from "@/controllers/permission.controller";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkRole } from "@/middlewares/checkRole";

const router = Router();

router.post("/", authenticateToken, checkRole(["Administrador"]), createPermission);
router.get("/", authenticateToken, checkRole(["Administrador"]), getAllPermissions);
router.get("/:id", authenticateToken, checkRole(["Administrador"]), getPermissionById);

export default router;
