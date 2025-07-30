import { Router } from "express";
import { uploadProfileImage } from "@/utils/upload";
import {
  createUser,
  getAllUsers,
  getUserById,
  assignRole,
  getUserWithRolesAndPermissions,
  updateUser,
} from "@/controllers/user.controller";

import { authenticateToken } from "@/middlewares/authenticateToken";
import { checkRole } from "@/middlewares/checkRole";

const router = Router();

/* =============================================================
   📌 RUTAS PROTEGIDAS - SOLO PARA USUARIOS CON ROL "Administrador"
   Estas rutas requieren JWT válido + verificación de rol
   ============================================================= */

// 👉 Obtener todos los usuarios (usado en la lista de Usuarios del frontend)
router.get("/", authenticateToken, checkRole(["Administrador"]), getAllUsers);

// 👉 Obtener usuario por ID (detalle para editar)
router.get("/:id", authenticateToken, checkRole(["Administrador"]), getUserById);

// 👉 Crear nuevo usuario con imagen de perfil (formulario con FormData)
router.post(
  "/",
  authenticateToken,
  checkRole(["Administrador"]),
  uploadProfileImage.single("profileImage"),
  createUser
);

// 👉 Actualizar usuario con imagen (edición con FormData)
router.put(
  "/:id",
  authenticateToken,
  checkRole(["Administrador"]),
  uploadProfileImage.single("profileImage"),
  updateUser
);

// 👉 Asignar rol a un usuario
router.post(
  "/assign-role",
  authenticateToken,
  checkRole(["Administrador"]),
  assignRole
);

/* =============================================================
   🔄 RUTA SEMI-PÚBLICA (ACCESO INTERNO ENTRE MICROSERVICIOS)
   Si el header "x-internal-call" está presente, omite auth
   ============================================================= */

router.get(
  "/:id/roles-permissions",
  (req, res, next) => {
    if (req.headers["x-internal-call"] === "true") {
      console.log("🔁 Llamada interna detectada, sin verificación de token");
      return next();
    }
    return authenticateToken(req, res, () =>
      checkRole(["Administrador"])(req, res, next)
    );
  },
  getUserWithRolesAndPermissions
);

export default router;
