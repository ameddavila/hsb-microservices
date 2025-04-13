import { sequelize } from "@/config/sequelize";
import app from "./app";

const PORT = process.env.PORT || 3001;

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la base de datos.");

    await sequelize.sync(); // Si deseas sincronizar modelos en desarrollo

    app.listen(PORT, () => {
      console.log(`🚀 Users-Service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

main();
