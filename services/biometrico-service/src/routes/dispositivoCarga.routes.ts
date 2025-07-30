import { Router } from "express";
import { cargarEmpleadosAlDispositivo } from "../controllers/dispositivoCarga.controller";

const router = Router();

router.post("/cargar-empleados", cargarEmpleadosAlDispositivo);

export default router;
