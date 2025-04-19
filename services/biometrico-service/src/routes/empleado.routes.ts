// src/modules/empleados/routes/empleado.routes.ts
import { Router } from 'express';
import { EmpleadoController } from '../controllers/empleado.controller';

const router = Router();
const controller = new EmpleadoController();

// Importación desde dispositivo ZKTeco
router.post('/sincronizar', controller.importarDesdeIp);

router.get('/', controller.obtenerTodos);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);



export default router;
