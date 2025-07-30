import dotenv from 'dotenv';
import { sequelize } from "@/config/sequelize";
import app from "./app";
import { defineRelations } from "@/relationships/biometrico.relations";
// Cargar variables de entorno antes de cualquier otra importación
dotenv.config();

const PORT = process.env.PORT || 3004;

async function main() {
  try {
    // 🌐 Conexión a base de datos
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la base de datos.");

    // 🔗 Definir relaciones entre modelos
    defineRelations();

    // 🔄 Sincronizar modelos si estás en desarrollo (opcional)
    await sequelize.sync();
    //await sequelize.sync({force:true});

    // 🚀 Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Biometrico-Service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

main();
