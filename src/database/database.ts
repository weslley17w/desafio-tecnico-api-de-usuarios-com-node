import { Sequelize, type Options } from 'sequelize';
import sequelizeConfig from './config.js';

class Database {
  public readonly connection: Sequelize;

  constructor(config: Options = sequelizeConfig) {
    this.connection = new Sequelize(config);
  }
}

export const db = new Database().connection;
