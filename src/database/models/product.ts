import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ModelAttributes,
} from 'sequelize';
import { db } from '../database.js';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare price: number;
  declare description: string;
  declare created_by: string;
  declare created_at: CreationOptional<Date>;
  declare update_at: CreationOptional<Date>;
}

const attributes: ModelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
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

Product.init(attributes, {
  sequelize: db,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
  paranoid: true,
});

export default Product;
