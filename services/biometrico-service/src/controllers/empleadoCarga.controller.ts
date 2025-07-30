import { Request, Response } from "express";
import { cargarEmpleadosBasicosSchema } from "../validators/empleadoCarga.validator";
import { EmpleadoCargaService } from "../services/empleadoCarga.service";

export class EmpleadoCargaController {
  static async cargarEmpleadosBasicos(req: Request, res: Response) {
    try {
      const { dispositivoId } = cargarEmpleadosBasicosSchema.parse(req.body);

      const resultado = await EmpleadoCargaService.cargarEmpleadosBasicos(dispositivoId);

      res.status(200).json(resultado);
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ success: false, mensaje: error.message || "Error cargando empleados." });
    }
  }
}
