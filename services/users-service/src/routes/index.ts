import { Router } from "express";
import userRoutes from "./user.routes";
import roleRoutes from "./role.routes";
import permissionRoutes from "./permission.routes";
import publicRoutes from "./public.routes"; 
const router = Router();

// 🔓 Rutas públicas (sin autenticación)
router.use("/", publicRoutes); // Accesibles en: /register, /forgot-password, etc.

// 🔐 Rutas protegidas (requieren token + rol)
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);

export default router;
