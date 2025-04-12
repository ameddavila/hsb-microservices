// src/index.ts
import app from "./app";
import { sequelize } from "./config/sequelize";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa");
    await sequelize.sync(); // Sincroniza modelos (útil en desarrollo)
    
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
}

main();
