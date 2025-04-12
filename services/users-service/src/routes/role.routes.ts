import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
} from "@/controllers/role.controller";
import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkRole } from "@/middlewares/checkRole";

const router = Router();

router.post("/", authenticateToken, checkRole(["admin"]), createRole);
router.get("/", authenticateToken, checkRole(["admin"]), getAllRoles);
router.get("/:id", authenticateToken, checkRole(["admin"]), getRoleById);

export default router;
