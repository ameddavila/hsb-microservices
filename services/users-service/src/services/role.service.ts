import RoleModel from "@/models/role.model";
import PermissionModel from "@/models/permission.model";

export class RoleService {
  static async createRole(data: Partial<RoleModel>) {
    return await RoleModel.create(data);
  }

  static async getAllRoles() {
    return await RoleModel.findAll({
      include: [PermissionModel],
    });
  }

  static async getRoleById(id: number) {
    const role = await RoleModel.findByPk(id, {
      include: [PermissionModel],
    });

    if (!role) throw new Error("Rol no encontrado");
    return role;
  }
}
