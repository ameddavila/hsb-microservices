import axios from "axios";
import {
  DispositivoResponse,
  ZKUsuario,
  ZKUsuarioResponse,
} from "@/types/types";

// 🔧 Configuración centralizada de Axios
const ZK_AGENT_BASE_URL =
  process.env.ZK_AGENT_BASE_URL || "http://localhost:3010";

const zkAgentApi = axios.create({
  baseURL: `${ZK_AGENT_BASE_URL}/api/biometria`,
  timeout: 10000,
});

// 📌 Manejo genérico de errores
const handleApiError = (error: any, contexto: string) => {
  const message =
    error.response?.data?.mensaje || error.message || "Error desconocido";
  console.error(`❌ Error en ${contexto}:`, message);
  throw new Error(`Error al ${contexto}: ${message}`);
};

// 🚀 Obtener dispositivos escaneados
export const obtenerDispositivosDesdeZKAgent = async (
  inicio: string,
  fin: string
) => {
  try {
    const { data } = await zkAgentApi.get<DispositivoResponse>("/scan/full", {
      params: { inicio, fin },
    });
    return data.dispositivos || [];
  } catch (error) {
    handleApiError(error, "obtener dispositivos desde zk-bioagent");
  }
};

// 🚀 Cliente para usuarios ZK
export class ZKAgentClient {
  /**
   * Obtiene la lista de usuarios desde un dispositivo.
   * Retorna un array vacío si no hay usuarios válidos.
   */
  static async obtenerUsuarios(ip: string): Promise<ZKUsuario[]> {
    try {
      const { data } = await zkAgentApi.get<ZKUsuarioResponse>("/usuarios", {
        params: { ip },
      });

      if (data.success && data.usuarios) {
        return data.usuarios;
      }

      console.warn(`⚠️ Respuesta sin usuarios desde dispositivo ${ip}`);
      return [];
    } catch (error) {
      handleApiError(error, `obtener usuarios del dispositivo ${ip}`);
      throw new Error(`No se pudo obtener usuarios del dispositivo ${ip}`);
    }
  }

  /**
   * Consulta el estado biométrico de un usuario específico.
   * Retorna null si falla.
   */
  static async consultarEstadoUsuario(
    ip: string,
    tipo: string,
    codigoEmpleado: string
  ): Promise<any | null> {
    try {
      const { data } = await zkAgentApi.get("/usuario", {
        params: { ip, tipo, codigos: codigoEmpleado },
      });
      return data;
    } catch (error) {
      handleApiError(
        error,
        `consultar estado de usuario ${codigoEmpleado} en ${ip}`
      );
    }
  }
}
