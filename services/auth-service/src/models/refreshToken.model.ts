import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import UserModel from "@models/user.model";

@Table({ tableName: "RefreshTokens", timestamps: true })
export default class RefreshTokenModel extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => UserModel)
  declare user: UserModel;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare token: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare deviceId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiresAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare lastUsedAt?: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare createdAt: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare updatedAt: Date;
}
