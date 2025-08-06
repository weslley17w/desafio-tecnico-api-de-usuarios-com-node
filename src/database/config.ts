import { Options } from 'sequelize';
import { env } from '../config/env.js';

const sequelizeConfig: Record<string, Options> = {
  development: {
    dialect: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    timezone: 'America/Sao_Paulo',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  test: {
    dialect: 'postgres',
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB + '_test',
    timezone: 'America/Sao_Paulo',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};

export default sequelizeConfig[env.NODE_ENV];
