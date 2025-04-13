import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  assignRole,
  getUserWithRolesAndPermissions,
} from "@/controllers/user.controller";

import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkRole } from "@/middlewares/checkRole";

const router = Router();

/**
 * 🔒 RUTAS PROTEGIDAS PARA ADMINISTRADORES
 * Solo usuarios con rol "Administrador" podrán acceder
 */

// 📌 Crear usuario manualmente (poco usado, ya que existe /register en rutas públicas)
router.post("/", authenticateToken, checkRole(["Administrador"]), createUser);

// 📌 Obtener todos los usuarios
router.get("/", authenticateToken, checkRole(["Administrador"]), getAllUsers);

// 📌 Asignar rol a un usuario
router.post("/assign-role", authenticateToken, checkRole(["Administrador"]), assignRole);

/**
 * 🔍 Obtener usuario por ID
 * Esta ruta está PROTEGIDA solo si no es llamada internamente.
 * Permite que `auth-service` pueda consumirla desde `user-client.service.ts`
 */
router.get(
  "/:id/roles-permissions",
  // Middleware condicional: si es llamada interna, omite verificación de token
  (req, res, next) => {
    if (req.headers["x-internal-call"] === "true") {
      console.log("🔁 Llamada interna detectada, sin verificación de token");
      return next();
    }
    // Si no es interna, aplicar auth + rol
    return authenticateToken(req, res, () =>
      checkRole(["Administrador"])(req, res, next)
    );
  },
  getUserWithRolesAndPermissions
);

/**
 * ✅ RUTA ABIERTA (PROBABLEMENTE PARA EL FRONT DE REGISTRO)
 * El registro se maneja como una ruta PÚBLICA y no debe requerir token.
 * Esta ruta debería estar en un archivo separado de rutas públicas, ej: `auth.routes.ts` o `public.routes.ts`.
 */
router.get("/:id", getUserById); // Puedes moverla a públicas si es usada por /auth

export default router;
