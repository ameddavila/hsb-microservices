import { Router } from 'express';
import { CargoController } from '../controllers/cargo.controller';

const router = Router();
const controller = new CargoController();

router.post('/', controller.crear);
router.get('/', controller.listar);

export default router;
