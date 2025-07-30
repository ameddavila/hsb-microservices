import axios from 'axios';
import EmpleadoModel from '../models/empleado.model';
import DispositivoModel from '../models/dispositivo.model';

export class EmpleadoZKService {
  async enviarEmpleadosADispositivo(dispositivoId: number) {
    const dispositivo = await DispositivoModel.findByPk(dispositivoId);
    if (!dispositivo) throw new Error('Dispositivo no encontrado');

    const empleados = await EmpleadoModel.findAll({ where: { activo: true } });

    const empleadosPayload = empleados.map((e) => ({
      id: e.codigoEmpleado,
      nombre: e.NombreBio || `${e.nombre} ${e.apellidoPaterno}`.trim()
    }));

    const res = await axios.post(`${process.env.ZK_AGENT_BASE_URL}/api/biometria/usuarios/cargar`, {
      ip: dispositivo.ip,
      empleados: empleadosPayload
    });

    return res.data;
  }
}
