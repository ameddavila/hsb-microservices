import { Router } from "express";
import { 
    sincronizarPlantillasController, 
    sincronizarCredencialesFaltantesController, 
    obtenerEstadoCredencialesController 
} from "../controllers/credencialBiometrica.controller";

const router = Router();

/**
 * 📥 Sincroniza plantillas biométricas desde un dispositivo específico hacia la BD.
 * 
 * 🔹 Endpoint:
 * GET /api/credenciales/sincronizar/dispositivo/:dispositivoId?tipo=rostro
 * 🔹 Tipos válidos: rostro | huella | password | palma
 */
router.get("/sincronizar/dispositivo/:dispositivoId", sincronizarPlantillasController);

/**
 * 📥 Sincroniza SOLO las credenciales faltantes según tipo para todos los empleados asignados.
 * 
 * 🔹 Endpoint:
 * GET /api/credenciales/sincronizar/faltantes?tipo=huella
 */
router.get("/sincronizar/faltantes", sincronizarCredencialesFaltantesController);

/**
 * 📊 Obtiene el estado actual de las credenciales biométricas desde la BD.
 * 
 * 🔹 Endpoint:
 * GET /api/credenciales/estado?tipo=rostro
 * 🔹 Tipos válidos: rostro | huella | password | palma | todo
 */
router.get("/estado", obtenerEstadoCredencialesController);

export default router;
