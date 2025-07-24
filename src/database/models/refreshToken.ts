import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ModelAttributes,
} from 'sequelize';
import { db } from '../database.js';
import { User } from './index.js';

export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
  declare id: CreationOptional<string>;
  declare token: string;
  declare expires_at: Date;
  declare created_by: string;
  declare created_at: CreationOptional<Date>;
  declare update_at: CreationOptional<Date>;
  declare creator: CreationOptional<User>;
}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
};

RefreshToken.init(attributes, {
  sequelize: db,
  modelName: 'RefreshToken',
  tableName: 'refresh_token',
  timestamps: true,
});

export default RefreshToken;
