// src/models/roleMenu.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import RoleModel from "./role.model";
import MenuModel from "./menu.model";

@Table({ tableName: "RoleMenus", timestamps: false })
export default class RoleMenuModel extends Model {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  declare roleId: number;

  @ForeignKey(() => MenuModel)
  @Column({ type: DataType.INTEGER, primaryKey: true })
  declare menuId: number;

  @BelongsTo(() => RoleModel)
  declare role: RoleModel;

  @BelongsTo(() => MenuModel)
  declare menu: MenuModel;
}
