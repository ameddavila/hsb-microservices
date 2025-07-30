import EmpleadoModel from "../models/empleado.model";
import EmpleadoDispositivoModel from "../models/empleadoDispositivo.model";
import DispositivoModel from "../models/dispositivo.model";
import axios from "axios";
import { TipoCredencial } from "@/types/types";  // Ajusta la ruta según tu estructura

import { Op } from "sequelize";

const BASE_ZK_AGENT = process.env.ZK_AGENT_BASE_URL || "http://localhost:3010";

class DispositivoCargaService {
  async cargarEmpleados({ ip, tipos, empleados }: { ip: string, tipos: TipoCredencial[], empleados: string[] }) {
    const dispositivo = await DispositivoModel.findOne({ where: { ip } });
    if (!dispositivo) throw new Error("❌ Dispositivo no registrado.");

    const puerto = dispositivo.puerto || 4370;

    // Si no se especifican tipos, asumimos todos
    const tiposFiltrados = tipos.length === 0 ? ["rostro", "huella", "password"] : tipos;

    let empleadosExportar;

    if (empleados.length === 0) {
      empleadosExportar = await EmpleadoModel.findAll({
        include: [
          { association: "dispositivosAsignados", required: false },
          { association: "credenciales", where: { tipo: tiposFiltrados, activo: true } }
        ]
      });
    } else {
      empleadosExportar = await EmpleadoModel.findAll({
        where: { codigoEmpleado: empleados },
        include: [
          { association: "dispositivosAsignados", required: false },
          { association: "credenciales", where: { tipo: tiposFiltrados, activo: true } }
        ]
      });
    }

    // Filtrar empleados que aún no están asignados al dispositivo
    const empleadosFinal = empleadosExportar.filter(emp => {
      const dispositivos = emp.getDataValue('dispositivosAsignados') || [];
      return !dispositivos.some((d: any) => d.ip === ip);
    });

    const payload = {
      ip,
      puerto,
      tipos: tiposFiltrados,
      datos: empleadosFinal.map(emp => {
        const credenciales = emp.getDataValue('credenciales') || [];
        const faceCredential = credenciales.find((c: any) => c.tipo === "rostro");
    
        let faceBuffer = faceCredential?.valor || "";
        let faceBase64 = "";
    
        if (Buffer.isBuffer(faceBuffer)) {
          faceBase64 = faceBuffer.toString('base64');
    
          // 📸 Log para ver tamaño del buffer y base64 generado
          console.log(`📸 [FaceBuffer] Empleado ${emp.codigoEmpleado}: BufferBytes=${faceBuffer.length} bytes, Base64Length=${faceBase64.length} caracteres`);
        } else if (typeof faceBuffer === "string" && faceBuffer.length > 0) {
          // Puede que ya venga como string (por error), igual logueamos
          console.log(`📸 [FaceString?] Empleado ${emp.codigoEmpleado}: StringLength=${faceBuffer.length}`);
          faceBase64 = faceBuffer;
        } else {
          console.log(`⚠️ [NoFaceData] Empleado ${emp.codigoEmpleado}: No se encontró rostro.`);
        }
        console.log(`📸 Empleado ${emp.codigoEmpleado} - Buffer face size: ${Buffer.isBuffer(faceBuffer) ? faceBuffer.length : 0}`);
        return {
          codigoEmpleado: emp.codigoEmpleado,
          nombre: emp.NombreBio,
          password: credenciales.find((c: any) => c.tipo === "password")?.valor || "",
          faceData: faceBase64, // 👈 Se envía el base64 generado
          fingerData: credenciales.find((c: any) => c.tipo === "huella")?.valor || ""
        };
      })
    };
    

    if (payload.datos.length === 0) {
      throw new Error("⚠️ No hay empleados pendientes de cargar en este dispositivo.");
    }

    const respuesta = await axios.post(`${BASE_ZK_AGENT}/api/biometria/cargar`, payload);
    const data = respuesta.data as { detalle: { codigoEmpleado: string, status: string }[], mensaje: string };

    // Registrar asignaciones solo si hubo éxito en algún tipo
    for (const res of data.detalle) {
      if (res.status.includes("✅")) {
        const empleado = empleadosFinal.find(e => e.codigoEmpleado === res.codigoEmpleado);
        if (!empleado) continue;

        await EmpleadoDispositivoModel.findOrCreate({
          where: {
            empleadoId: empleado.empleadoId,
            dispositivoId: dispositivo.dispositivoId
          },
          defaults: {
            fechaAsignacion: new Date(),
            activo: true
          }
        });
      }
    }

    return data;
  }
}

export default new DispositivoCargaService();
