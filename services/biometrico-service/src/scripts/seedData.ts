// src/seed/seedData.ts
import { sequelize } from "@/config/sequelize";
import ZonaModel from "@/models/zona.model";
import DispositivoModel from "@/models/dispositivo.model";

export const seedData = async () => {
  try {
    console.log("🌱 Iniciando seed de datos biométricos...");

    // 🧹 Eliminar datos anteriores (en orden por FK)
    await DispositivoModel.destroy({ where: {} });
    await ZonaModel.destroy({ where: {} });
    // Crear una zona
    const zona = await ZonaModel.create({
      nombre: "Biometrico Facial",
      descripcion: "Solo Personal de Planta",
    });

    // Crear un dispositivo vinculado a esa zona
    await DispositivoModel.create({
      zonaId: zona.zonaId,
      nombre: "Dispositivo Prueba",
      numeroSerie: "ZK-123456",
      ip: "192.168.6.51",
      puerto: 4370,
      ubicacion: "Puerta principal",
      modelo: "ZKTeco G3 PRO",
    });

    console.log("✅ Seed de datos biométricos completado.");
  } catch (error) {
    console.error("❌ Error en el seed:", error);
  } finally {
    await sequelize.close();
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedData();
}
