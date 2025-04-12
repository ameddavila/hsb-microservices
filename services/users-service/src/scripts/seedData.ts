import { sequelize } from "@/config/sequelize";
import bcrypt from "bcrypt";
import UserModel from "@/models/user.model";
import RoleModel from "@/models/role.model";
import PermissionModel from "@/models/permission.model";
import UserRoleModel from "@/models/userRole.model";
import RolePermissionModel from "@/models/rolePermission.model";

const SALT_ROUNDS = 10;

async function seedData() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la base de datos");

    // Sync en desarrollo
    await sequelize.sync({ alter: true });

    // Crear permisos
    const permissions = await PermissionModel.bulkCreate([
      {
        name: "Gestionar usuarios",
        action: "manage",
        module: "usuarios",
        description: "Permite crear, editar y eliminar usuarios",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Ver usuarios",
        action: "read",
        module: "usuarios",
        description: "Permite listar los usuarios del sistema",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], { ignoreDuplicates: true });

    // Crear rol administrador
    const adminRole = await RoleModel.findOrCreate({
      where: { name: "Administrador" },
      defaults: {
        description: "Rol con acceso total",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Asociar permisos al rol
    const role = adminRole[0];
    await role.setPermissions(permissions);

    // Crear usuario admin
    const adminEmail = "admin@example.com";
    const existingAdmin = await UserModel.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin1234!", SALT_ROUNDS);
      const adminUser = await UserModel.create({
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Principal",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await UserRoleModel.create({ userId: adminUser.id, roleId: role.id });
      console.log("👤 Usuario administrador creado exitosamente");
    } else {
      console.log("ℹ️ Usuario administrador ya existe");
    }

    console.log("✅ Seed finalizado correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  }
}

seedData();
