// src/modules/empleados/services/empleado.service.ts

import { Op } from 'sequelize';
import EmpleadoModel from '@/models/empleado.model';
import EmpleadoDispositivoModel from '@/models/empleadoDispositivo.model';
import DepartamentoModel from '@/models/departamento.model';
import FuenteFinanciamientoModel from '@/models/fuenteFinanciamiento.model';
import CargoModel from '@/models/cargo.model';
import DispositivoModel from '@/models/dispositivo.model';
import { ZKAgentClient } from '@/services/zkBioagentClient.service';

export class EmpleadoService {
  async crearEmpleado(data: any) {
    return await EmpleadoModel.create(data);
  }

  async obtenerTodosEmpleados() {
    return await EmpleadoModel.findAll();
  }

  async obtenerEmpleadoPorId(id: number) {
    return await EmpleadoModel.findByPk(id);
  }

  async actualizarEmpleado(id: number, data: any) {
    const empleado = await EmpleadoModel.findByPk(id);
    if (!empleado) throw new Error('Empleado no encontrado');
    return await empleado.update(data);
  }

  async eliminarEmpleado(id: number) {
    const empleado = await EmpleadoModel.findByPk(id);
    if (!empleado) throw new Error('Empleado no encontrado');
    await empleado.destroy();
    return { message: 'Empleado eliminado correctamente' };
  }

  async importarDesdeDispositivoPorIp(ip: string) {
    const usuarios = await ZKAgentClient.obtenerUsuarios(ip);
    const resultados = [];

    // 🔍 Buscar dispositivo por IP
    const dispositivo = await DispositivoModel.findOne({ where: { ip } });
    if (!dispositivo) {
      throw new Error(`❌ No se encontró un dispositivo con IP ${ip}`);
    }

    for (const usuario of usuarios) {
      const codigoEmpleado = usuario.id;
      const NombreBio = usuario.nombre;

      // 🔍 Buscar registros "Default"
      const departamento = await DepartamentoModel.findOne({
        where: { nombre: { [Op.like]: '%Default%' } }
      });

      const fuente = await FuenteFinanciamientoModel.findOne({
        where: { nombre: { [Op.like]: '%Default%' } }
      });

      const cargo = await CargoModel.findOne({
        where: { nombre: { [Op.like]: '%Default%' } }
      });

      if (!departamento || !fuente || !cargo) {
        throw new Error("❌ No se encontraron registros por defecto en Departamento, Fuente o Cargo.");
      }

      console.log({
        departamentoId: departamento.id,
        fuenteFinanciamientoId: fuente.id,
        cargoId: cargo.id
      });

      // 👉 Crear o recuperar empleado
      const [empleado, creado] = await EmpleadoModel.findOrCreate({
        where: { codigoEmpleado },
        defaults: {
          codigoEmpleado,
          NombreBio,
          fechaIngreso: new Date(),
          carnetIdentidad: `CI-${codigoEmpleado}`,
          departamentoId: departamento.id,
          fuenteFinanciamientoId: fuente.id,
          cargoId: cargo.id
        }
      });

      // 🔁 Asociar al dispositivo si aún no lo está
      const relacion = await EmpleadoDispositivoModel.findOne({
        where: {
          empleadoId: empleado.empleadoId,
          dispositivoId: dispositivo.dispositivoId
        }
      });

      if (!relacion) {
        await EmpleadoDispositivoModel.create({
          empleadoId: empleado.empleadoId,
          dispositivoId: dispositivo.dispositivoId,
          fechaAsignacion: new Date(),
          activo: true
        });
      }

      resultados.push({ empleado, creado });
    }

    return resultados;
  }
}
