import { Router } from 'express';
import { FuenteFinanciamientoController } from '../controllers/fuenteFinanciamiento.controller';

const router = Router();
const controller = new FuenteFinanciamientoController();

router.post('/', controller.crear);
router.get('/', controller.listar);

export default router;
