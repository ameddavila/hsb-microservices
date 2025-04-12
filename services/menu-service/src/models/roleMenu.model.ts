import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";

import MenuModel from "./menu.model";

// Solo importa RoleModel si estás dentro del mismo servicio
import RoleModel from "./role.model";

@Table({ tableName: "RoleMenus", timestamps: false })
export default class RoleMenuModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  declare roleId: number;

  @ForeignKey(() => MenuModel)
  @Column({ type: DataType.INTEGER, allowNull: false, primaryKey: true })
  declare menuId: number;

  @BelongsTo(() => RoleModel)
  declare role: RoleModel;

  @BelongsTo(() => MenuModel)
  declare menu: MenuModel;
}
