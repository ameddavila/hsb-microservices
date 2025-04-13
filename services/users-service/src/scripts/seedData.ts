import { sequelize } from "@/config/sequelize";
import bcrypt from "bcrypt";
import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";
import PermissionModel from "@/models/permission.model";
import UserRoleModel from "@/models/userRole.model";

const SALT_ROUNDS = 10;

async function seedData() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    // 🛠️ Sync en desarrollo
    await sequelize.sync({ force: true });

    // 🚨 Permisos a crear
    const basePermissions = [
      {
        name: "Gestionar usuarios",
        action: "manage",
        module: "usuarios",
        description: "Permite crear, editar y eliminar usuarios",
      },
      {
        name: "Ver usuarios",
        action: "read",
        module: "usuarios",
        description: "Permite listar los usuarios del sistema",
      },
    ];

    // 📌 Crear permisos solo si no existen
    for (const perm of basePermissions) {
      const exists = await PermissionModel.findOne({
        where: { action: perm.action, module: perm.module },
      });
      if (!exists) await PermissionModel.create(perm);
    }

    // ✅ Obtener permisos ya insertados
    const permissions = await PermissionModel.findAll();

    // 🔐 Rol administrador
    const [adminRole] = await RoleModel.findOrCreate({
      where: { name: "Administrador" },
      defaults: { description: "Rol con acceso total" },
    });

    // 👤 Rol invitado
    const [guestRole] = await RoleModel.findOrCreate({
      where: { name: "Invitado" },
      defaults: { description: "Rol limitado solo para navegación o registro básico" },
    });

    // 🔗 Asociar permisos al rol administrador (sobrescribe los existentes)
    await adminRole.setPermissions(permissions);

    // 👤 Crear usuario administrador
    const adminEmail = "admin@example.com";
    const existingAdmin = await UserModel.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin1234!", SALT_ROUNDS);
      const adminUser = await UserModel.create({
        dni:"123456789",
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Principal",
        isActive: true,
      });

      await UserRoleModel.create({ userId: adminUser.id, roleId: adminRole.id });
      console.log("👤 Usuario administrador creado exitosamente");
    } else {
      console.log("ℹ️ Usuario administrador ya existe");
    }

    console.log("✅ Seed ejecutado correctamente con roles y permisos base.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
}

seedData();
