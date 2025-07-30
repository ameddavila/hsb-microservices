import { Router } from "express";
import { EmpleadoCargaController } from "../controllers/empleadoCarga.controller";

const router = Router();

// POST /api/empleados/cargar-basico
router.post("/cargar-basico", EmpleadoCargaController.cargarEmpleadosBasicos);

export default router;
