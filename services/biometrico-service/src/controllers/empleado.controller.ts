// src/modules/empleados/controllers/empleado.controller.ts
import { Request, Response } from 'express';
import { EmpleadoService } from '../services/empleado.service';

const service = new EmpleadoService();

export class EmpleadoController {
  async crear(req: Request, res: Response) {
    try {
      const empleado = await service.crearEmpleado(req.body);
      res.json(empleado);
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Error desconocido' });
        }
    }
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      const empleados = await service.obtenerTodosEmpleados();
      res.json({ success: true, data: empleados });
    } catch (error) { //amed solucion a err.message
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Error inesperado' });
      }
    }
    }
  
  async obtenerPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const empleado = await service.obtenerEmpleadoPorId(id);
    if (!empleado) return res.status(404).json({ error: 'No encontrado' });
    res.json(empleado);
  }

  async actualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const actualizado = await service.actualizarEmpleado(id, req.body);
      res.json(actualizado);
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Error desconocido' });
        }
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const resultado = await service.eliminarEmpleado(id);
      res.json(resultado);
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Error desconocido' });
        }
    }
  }

  async importarDesdeIp(req: Request, res: Response) {
    try {
      const { ip } = req.body;
      if (!ip) return res.status(400).json({ error: 'IP requerida' });
  
      const resultado = await service.importarDesdeDispositivoPorIp(ip);
      res.json({ success: true, data: resultado });
    } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Error desconocido' });
        }
    }
  }
}
