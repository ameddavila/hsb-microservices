import { Router } from "express";
import {
  obtenerZonasController,
  crearZonaController,
  getZonaById,
  updateZona,
  deleteZona,
} from "@/controllers/zona.controller";

import { authenticateToken } from "@/middlewares/authenticateToken";
// Si luego agregas control por permisos específicos, puedes usar este:
import { checkPermission } from "@/middlewares/checkPermission";

const router = Router();

/**
 * 🔐 Todas las rutas están protegidas:
 * - Requieren token JWT
 * - Solo usuarios con rol "Administrador"
 */

// Obtener todas las zonas
router.get(
  "/",
  authenticateToken,
  checkPermission(["Administrador"]),
  obtenerZonasController
);

// Obtener una zona por ID
router.get(
  "/:id",
  authenticateToken,
  checkPermission(["Administrador"]),
  getZonaById
);

// Crear nueva zona
router.post(
  "/",
  authenticateToken,
  checkPermission(["Administrador"]),
  crearZonaController
);

// Actualizar zona existente
router.put(
  "/:id",
  authenticateToken,
  checkPermission(["Administrador"]),
  updateZona
);

// Eliminar zona
router.delete(
  "/:id",
  authenticateToken,
  checkPermission(["Administrador"]),
  deleteZona
);

export default router;
