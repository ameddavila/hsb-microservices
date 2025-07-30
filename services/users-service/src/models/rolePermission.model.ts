import {
  Table,
  Column,
  Model,
  ForeignKey,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import PermissionModel from "./permission.model";

@Table({ tableName: "RolePermissions", timestamps: false })
export default class RolePermissionModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column
  declare roleId: number;

  @ForeignKey(() => PermissionModel)
  @Column
  declare permissionId: number;
}
