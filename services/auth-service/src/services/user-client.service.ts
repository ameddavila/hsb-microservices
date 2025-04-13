// src/services/user-client.service.ts
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || "http://localhost:3002/api";

// 🎯 Interfaz esperada desde el user-service
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  dni: string;
  roles: string[];           // 🔄 nombres de roles
  permissions: string[];     // 🔄 permisos como "read:usuarios"
}

export const UserClientService = {
  async getUserWithRoles(userId: string): Promise<UserResponse> {
    console.log("🌐 [UserClientService] Consultando roles y permisos para usuario:", userId);
    console.log("🔗 URL:", `${USERS_SERVICE_URL}/users/${userId}/roles-permissions`);

    try {
      const { data } = await axios.get(`${USERS_SERVICE_URL}/users/${userId}/roles-permissions`, {
        headers: {
          "x-internal-call": "true",
        },
      });

      console.log("✅ [UserClientService] Respuesta recibida:");
      console.log("📦 ID:", data.id);
      console.log("👤 Usuario:", data.username);
      console.log("🧑‍💼 Roles:", data.roles);
      console.log("🔐 Permisos:", data.permissions);

      // Validación rápida del shape de los datos
      if (!data || !data.roles || !data.permissions) {
        throw new Error("Respuesta incompleta del user-service");
      }

      return data as UserResponse;
    } catch (error: any) {
      console.error("❌ [UserClientService] Error al obtener usuario desde user-service:");
      console.error("📦 Código HTTP:", error.response?.status);
      console.error("📦 Mensaje:", error.response?.data?.error || error.message);
      throw new Error("No se pudo obtener la información del usuario desde user-service");
    }
  }
};
