import ZKLib from "node-zklib";
import DispositivoModel from "@/models/dispositivo.model";

const crearConexion = async (dispositivoId: number) => {
  const dispositivo = await DispositivoModel.findByPk(dispositivoId);
  if (!dispositivo) throw new Error("Dispositivo no encontrado");

  const zk = new ZKLib(dispositivo.ip, dispositivo.puerto, 10000, 4000);
  await zk.createSocket();
  return zk;
};

export const probarConexion = async (dispositivoId: number) => {
  const zk = await crearConexion(dispositivoId);
  const info = await zk.getInfo();
  await zk.disconnect();
  return info;
};

export const obtenerUsuarios = async (dispositivoId: number) => {
  const zk = await crearConexion(dispositivoId);
  const users = await zk.getUsers();
  await zk.disconnect();
  return users;
};

export const obtenerMarcaciones = async (dispositivoId: number) => {
  const zk = await crearConexion(dispositivoId);
  const logs = await zk.getAttendances();
  await zk.disconnect();
  return logs;
};

export const obtenerUsuariosConBiometria = async (dispositivoId: number) => {
    const zk = await crearConexion(dispositivoId);
    const result = await zk.getUsers();
    await zk.disconnect();
  
    const users = result.data || [];
  
    // Mostrar solo los 3 primeros en consola para depurar
    console.log("🧪 Usuarios (primeros 3):");
    console.dir(users.slice(0, 3), { depth: null });
  
    return users.map((u: any) => ({
      codigoEmpleado: u.userid,
      nombre: u.name,
      fingerprintFlag: u.fingerprintFlag,
      faceFlag: u.faceFlag,
      tieneHuella: u.fingerprintFlag === 1,
      tieneFacial: u.faceFlag === 1,
    }));
  };
  