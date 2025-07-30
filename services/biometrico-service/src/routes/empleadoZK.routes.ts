import { Router } from 'express';
import { EmpleadoZKController } from '../controllers/empleadoZK.controller';

const router = Router();
const controller = new EmpleadoZKController();

router.post('/enviar-a-dispositivo', controller.enviar);

export default router;
