// ✅ FILE: src/models/userRole.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import UserModel from "./user.model";
import RoleModel from "./role.model";

@Table({ tableName: "UserRoles", timestamps: false })
export default class UserRoleModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  declare userId: string;

  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  declare roleId: number;

  // 🔁 Relaciones inversas
  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @BelongsTo(() => RoleModel)
  declare role: RoleModel;
}
