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

    await sequelize.sync({ force: true }); // ⚠️ Elimina y recrea todas las tablas

    // 📋 Definir permisos base
    const permissionsData = [
      {
        name: "Gestionar usuarios",
        action: "manage",
        module: "usuarios",
        description: "Permite crear, editar y eliminar usuarios"
      },
      {
        name: "Ver usuarios",
        action: "read",
        module: "usuarios",
        description: "Permite listar los usuarios del sistema"
      },
      {
        name: "Ver menús",
        action: "read",
        module: "menus",
        description: "Permite ver menús asignados"
      },
      {
        name: "Gestionar menús",
        action: "manage",
        module: "menus",
        description: "Permite crear, editar o eliminar menús"
      }
    ];

    // 📌 Insertar permisos individualmente (evitar error en MSSQL)
    const permissions: PermissionModel[] = [];
    for (const perm of permissionsData) {
      const exists = await PermissionModel.findOne({
        where: { action: perm.action, module: perm.module }
      });

      if (!exists) {
        const created = await PermissionModel.create(perm);
        permissions.push(created);
      } else {
        permissions.push(exists);
      }
    }

    // 🔐 Crear roles
    const [adminRole] = await RoleModel.findOrCreate({
      where: { name: "Administrador" },
      defaults: { description: "Rol con acceso total" }
    });

    const [guestRole] = await RoleModel.findOrCreate({
      where: { name: "Invitado" },
      defaults: { description: "Rol con acceso limitado" }
    });

    // 🔗 Asociar permisos a roles
    await adminRole.setPermissions(permissions);

    const guestPermissions = permissions.filter(p => p.action === "read");
    await guestRole.setPermissions(guestPermissions);

    // 👤 Crear usuario admin con rol
    const adminEmail = "admin@example.com";
    const existingAdmin = await UserModel.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin1234!", SALT_ROUNDS);
      const adminUser = await UserModel.create({
        dni: "123456789",
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        firstName: "Admin",
        lastName: "Principal",
        isActive: true
      });
      await UserRoleModel.create({ userId: adminUser.id, roleId: adminRole.id });
      console.log("👤 Usuario administrador creado exitosamente");
    } else {
      console.log("ℹ️ Usuario administrador ya existe");
    }

    console.log("✅ Seed ejecutado correctamente con roles y permisos diferenciados.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }
}

seedData();
