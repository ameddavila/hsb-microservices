import { Request, Response } from 'express';
import { EmpleadoZKService } from '../services/empleadoZK.service';

const service = new EmpleadoZKService();

export class EmpleadoZKController {
  async enviar(req: Request, res: Response) {
    try {
      const { dispositivoId } = req.body;
      if (!dispositivoId) return res.status(400).json({ success: false, message: 'dispositivoId es requerido' });

      const resultado = await service.enviarEmpleadosADispositivo(dispositivoId);
      res.json({ success: true, resultado });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
