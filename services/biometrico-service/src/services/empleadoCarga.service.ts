import  EmpleadoModel  from "@/models/empleado.model";
import  EmpleadoDispositivoModel  from "@/models/empleadoDispositivo.model";
import  DispositivoModel from "@/models/dispositivo.model";
import { axiosZkBioAgent } from "@utils/axiosInstances";  // tu instancia HTTP
import {logger} from "@/utils/logger";
import { Op } from "sequelize";


interface RespuestaCargaBasica {
  success: boolean;
  mensaje: string;
}

  
  export class EmpleadoCargaService {
    static async cargarEmpleadosBasicos(dispositivoId: number) {
      // Verificar que el dispositivo existe
      const dispositivo = await DispositivoModel.findByPk(dispositivoId);
      if (!dispositivo) {
        throw new Error("Dispositivo no encontrado");
      }
  
      // Buscar empleados asignados actualmente al dispositivo
      const empleadosAsignados = await EmpleadoDispositivoModel.findAll({
        where: { dispositivoId },
        attributes: ['empleadoId']
      });
  
      const idsAsignados = empleadosAsignados.map(e => e.empleadoId);
  
      // Condición: si no hay asignados, traer TODOS los empleados
      const whereCondition = idsAsignados.length > 0
        ? { empleadoId: { [Op.notIn]: idsAsignados } }
        : {}; // todos
  
      // Buscar empleados que faltan cargar (o todos si no hay asignados)
      const empleados = await EmpleadoModel.findAll({
        where: whereCondition,
        attributes: ['empleadoId', 'codigoEmpleado', 'NombreBio']
      });
  
      if (empleados.length === 0) {
        return { success: true, mensaje: "✅ No hay empleados pendientes de cargar." };
      }
  
      // Insertar asignaciones
      for (const emp of empleados) {
        await EmpleadoDispositivoModel.create({
          empleadoId: emp.empleadoId,
          dispositivoId
        });
      }
  
      logger.info(`📝 Asignados ${empleados.length} empleados al dispositivo ${dispositivo.ip}`);
  
      // Preparar payload
      const payload = empleados.map(emp => ({
        CodigoEmpleado: emp.codigoEmpleado,
        Nombre: emp.NombreBio
      }));
      
      
      console.log("Payload a enviar a zk-bioagent:", {
        ip: dispositivo.ip,
        empleados: payload
      });
      
      // Enviar al zk-bioagent
      const respuesta = await axiosZkBioAgent.post<RespuestaCargaBasica>("/api/biometria/empleados/cargar-basico", {
        ip: dispositivo.ip,
        empleados: payload
      });
      
      return {
        success: respuesta.data.success,
        mensaje: respuesta.data.mensaje,
        empleadosCargados: payload.length
      };
    }
  }
  