import {
  Table,
  Column,
  Model,
  DataType,
  Index,
  PrimaryKey,
  Default,
  BelongsToMany,
  CreatedAt,
  UpdatedAt,
} from "sequelize-typescript";

import RoleModel from "./role.model";
import UserRoleModel from "./userRole.model";

@Table({ tableName: "Users", timestamps: true })
export default class UserModel extends Model {
  // 🆔 ID generado automáticamente como UUID
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  // 🪪 DNI único
  @Index({ unique: true })
  @Column({ type: DataType.STRING(20), allowNull: false })
  declare dni: string;

  // 👤 Nombre de usuario único
  @Index({ unique: true })
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare username: string;

  // 📧 Email único
  @Index({ unique: true })
  @Column({ type: DataType.STRING(100), allowNull: false })
  declare email: string;

  // 🔐 Contraseña encriptada
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare password: string;

  // 🧑 Nombre y Apellido
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare firstName: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare lastName: string;

  // 📱 Teléfono opcional
  @Column({ type: DataType.STRING(20), allowNull: true })
  declare phone?: string;

  // ✅ Activo por defecto (compatible con MSSQL)
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  // 🖼️ Imagen de perfil opcional
  @Column({ type: DataType.STRING(255), allowNull: true })
  declare profileImage?: string;

  // 🔄 Campos para recuperación de contraseña
  @Column({ type: DataType.STRING(255), allowNull: true })
  declare passwordResetToken?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare passwordResetExpires?: Date;

  // 🔗 Relación Many-to-Many con Roles
  @BelongsToMany(() => RoleModel, () => UserRoleModel)
  declare roles?: RoleModel[];

  // 🕒 Timestamps automáticos
  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
