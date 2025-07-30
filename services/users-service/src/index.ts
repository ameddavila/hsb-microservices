// ✅ Cargar variables de entorno antes de cualquier otra cosa
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "@/config/sequelize";
import app from "./app";

const PORT = process.env.PORT || 3001;

async function main() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la base de datos.");

    sequelize.sync(); // o { force: true } si estás en desarrollo

    app.listen(PORT, () => {
      console.log(`🚀 Users-Service corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
}

main();
