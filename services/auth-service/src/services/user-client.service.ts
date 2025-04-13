// src/services/user-client.service.ts
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || "http://localhost:3002/api";

interface Role {
  id: number;
  name: string;
  permissions?: { action: string; module: string }[];
}

interface UserResponse {
  id: string;
  username: string;
  email: string;
  dni: string;
  roles: Role[];
}

export const UserClientService = {
  async getUserWithRoles(userId: string): Promise<UserResponse> {
    console.log("🌐 [UserClientService] Iniciando consulta de roles y permisos para usuario:", userId);

    try {
      const { data } = await axios.get(`${USERS_SERVICE_URL}/users/${userId}`, {
        headers: {
          "x-internal-call": "true", // Llamada interna autorizada
        },
      });

      console.log("✅ [UserClientService] Usuario obtenido correctamente:", {
        id: data.user.id,
        username: data.user.username,
        roles: data.user.roles?.map((r: any) => r.name),
      });

      return data.user;
    } catch (error: any) {
      console.error("❌ [UserClientService] Error al obtener usuario desde user-service:");
      console.error("📦 Código de estado:", error.response?.status);
      console.error("📦 Mensaje:", error.response?.data?.error || error.message);
      throw new Error("No se pudo obtener la información del usuario");
    }
  },
};
