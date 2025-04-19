import { Request, Response } from 'express';
import { departamentoSchema } from '@/validators/departamento.validator';
import { DepartamentoService } from '../services/departamento.service';

const service = new DepartamentoService();

export class DepartamentoController {
  async crear(req: Request, res: Response) {
    try {
      const { nombre } = departamentoSchema.parse(req.body);
      const nuevo = await service.crear(nombre);
      res.json({ success: true, data: nuevo });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error inesperado';
      res.status(400).json({ success: false, message: msg });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const departamentos = await service.obtenerTodos();
      res.json({ success: true, data: departamentos });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar' });
    }
  }
}
