import { Router } from "express";
import userRoutes from "./user.routes";
import roleRoutes from "./role.routes";
import permissionRoutes from "./permission.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);

export default router;
