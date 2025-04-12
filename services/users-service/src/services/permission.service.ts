
import PermissionModel from "@/models/permission.model";

export class PermissionService {
  static async createPermission(data: Partial<PermissionModel>) {
    return await PermissionModel.create(data);
  }

  static async getAllPermissions() {
    return await PermissionModel.findAll();
  }

  static async getPermissionById(id: number) {
    const permission = await PermissionModel.findByPk(id);
    if (!permission) throw new Error("Permiso no encontrado");
    return permission;
  }
}
