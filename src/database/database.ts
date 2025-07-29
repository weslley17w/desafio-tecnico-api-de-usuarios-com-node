import { Sequelize, type Options } from 'sequelize';
import sequelizeConfig from './config.js';

class Database {
  public readonly connection: Sequelize;

  constructor(config: Options = sequelizeConfig) {
    this.connection = new Sequelize(config);
  }
}

export const connectDatabase = async () => {
  await new Database().connection.authenticate();
  console.log('Database connection has been established successfully.');
};

export const db = new Database().connection;
