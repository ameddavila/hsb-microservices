import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import UserModel from "./user.model";

@Table({ tableName: "RefreshTokens", timestamps: true })
export default class RefreshTokenModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare token: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare deviceId: string;

  @Column({ type: DataType.DATE, allowNull: false })
  declare expiresAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastUsedAt?: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  // ✅ Relación con usuario
  @BelongsTo(() => UserModel)
  declare user?: UserModel;
}
