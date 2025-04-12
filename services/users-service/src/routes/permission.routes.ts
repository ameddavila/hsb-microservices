import { Router } from "express";
import {
  createPermission,
  getAllPermissions,
  getPermissionById,
} from "@/controllers/permission.controller";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkRole } from "@/middlewares/checkRole";

const router = Router();

router.post("/", authenticateToken, checkRole(["admin"]), createPermission);
router.get("/", authenticateToken, checkRole(["admin"]), getAllPermissions);
router.get("/:id", authenticateToken, checkRole(["admin"]), getPermissionById);

export default router;
