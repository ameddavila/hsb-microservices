import { Request, Response } from 'express';
import { fuenteSchema } from '../validators/fuenteFinanciamiento.validator';
import { FuenteFinanciamientoService } from '../services/fuenteFinanciamiento.service';

const service = new FuenteFinanciamientoService();

export class FuenteFinanciamientoController {
  async crear(req: Request, res: Response) {
    try {
      const { nombre, codigo } = fuenteSchema.parse(req.body);
      const nueva = await service.crear(nombre, codigo);
      res.json({ success: true, data: nueva });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error inesperado';
      res.status(400).json({ success: false, message: msg });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const fuentes = await service.obtenerTodas();
      res.json({ success: true, data: fuentes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al listar fuentes' });
    }
  }
}
