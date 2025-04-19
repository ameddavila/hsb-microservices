import { Request, Response } from 'express';
import { cargoSchema } from '@/validators/cargo.validator';
import { CargoService } from '../services/cargo.service';

const service = new CargoService();

export class CargoController {
  async crear(req: Request, res: Response) {
    try {
      const { nombre } = cargoSchema.parse(req.body);
      const nuevo = await service.crear(nombre);
      res.json({ success: true, data: nuevo });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error inesperado';
      res.status(400).json({ success: false, message: msg });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const cargos = await service.obtenerTodos();
      res.json({ success: true, data: cargos });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar cargos' });
    }
  }
}
