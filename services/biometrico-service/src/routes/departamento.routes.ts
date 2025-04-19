import { Router } from 'express';
import { DepartamentoController } from '../controllers/departamento.controller';

const router = Router();
const controller = new DepartamentoController();

router.post('/', controller.crear);
router.get('/', controller.listar);

export default router;
