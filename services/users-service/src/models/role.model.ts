import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";
import PermissionModel from "./permission.model";
import RolePermissionModel from "./rolePermission.model";
import UserModel from "./user.model";
import UserRoleModel from "./userRole.model";

@Table({ tableName: "Roles", timestamps: true })
export default class RoleModel extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description?: string;

  @BelongsToMany(() => UserModel, () => UserRoleModel)
  declare users?: UserModel[];

  @BelongsToMany(() => PermissionModel, () => RolePermissionModel)
  declare permissions?: PermissionModel[];

  @CreatedAt
  @Column(DataType.DATE)
  declare createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  declare updatedAt: Date;


  // Al final de tu clase RoleModel
// Estos métodos mágicos los genera Sequelize pero debes declararlos tú

public setPermissions!: (permissions: PermissionModel[] | number[]) => Promise<void>;
public getPermissions!: () => Promise<PermissionModel[]>;
public addPermission!: (permission: PermissionModel | number) => Promise<void>;
public removePermission!: (permission: PermissionModel | number) => Promise<void>;
public hasPermission!: (permission: PermissionModel | number) => Promise<boolean>;

}

