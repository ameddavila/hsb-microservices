import axios from "axios";
import { DispositivoResponse, ZKUsuario, ZKUsuarioResponse } from "@/types/types"; // Asegúrate que esté correctamente definido

// 🔧 URL base del microservicio zk-bioagent
const ZK_AGENT_BASE_URL = process.env.ZK_AGENT_BASE_URL || "http://localhost:3010";

export const obtenerDispositivosDesdeZKAgent = async (inicio: string, fin: string) => {
  try {
    const res = await axios.get<DispositivoResponse>(
      `${ZK_AGENT_BASE_URL}/api/biometria/scan/full`,
      {
        params: { inicio, fin }
      }
    );

    return res.data.dispositivos || [];
  } catch (error: any) {
    console.error("❌ Error al obtener dispositivos desde zk-bioagent:", error.message);
    throw new Error("No se pudo obtener dispositivos desde zk-bioagent");
  }
};

export class ZKAgentClient {
  static async obtenerUsuarios(ip: string): Promise<ZKUsuario[]> {
    const url = `${ZK_AGENT_BASE_URL}/api/biometria/usuarios?ip=${ip}`;
    const res = await axios.get<ZKUsuarioResponse>(url);

    if (res.data.success && res.data.usuarios) {
      return res.data.usuarios;
    }

    throw new Error("Error al obtener usuarios del dispositivo");
  }
}