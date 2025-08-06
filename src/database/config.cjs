const sequelizeConfig = {
  development: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    timezone: 'America/Sao_Paulo',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  test: {
    dialect: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB + '_test',
    timezone: 'America/Sao_Paulo',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
}

module.exports = sequelizeConfig[process.env.NODE_ENV]
