import { sequelize } from "@/config/sequelize";
import DepartamentoModel from "@/models/departamento.model";
import FuenteFinanciamientoModel from "@/models/fuenteFinanciamiento.model";
import CargoModel from "@/models/cargo.model";

export const seedData = async () => {
  try {
    console.log("🌱 Iniciando seed de datos iniciales...");

    // ✅ Crear Departamento Default si no existe
    await DepartamentoModel.findOrCreate({
      where: { nombre: "Departamento Default" }
    });

    // ✅ Crear Fuente Default si no existe
    await FuenteFinanciamientoModel.findOrCreate({
      where: { nombre: "Fuente Default" }, 
      defaults: { codigo: "FF001" } // Si tu modelo requiere código
    });

    // ✅ Crear Cargo Default si no existe
    await CargoModel.findOrCreate({
      where: { nombre: "Cargo Default" }
    });

    console.log("✅ Seed de datos completado.");
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
