import path from 'path';
import fs from 'fs';
import { Sequelize, type Options } from 'sequelize';
import sequelizeConfig from './config.js';

class Database {
  public readonly connection: Sequelize;
  private readonly models: { [key: string]: Sequelize & { associate?: (models: object) => void } } = {};

  constructor(config: Options = sequelizeConfig) {
    this.connection = new Sequelize(config);
  }

  private async load(): Promise<void> {
    const modelsPath = path.resolve('src', 'database', 'models');
    const files = await fs.promises.readdir(modelsPath);
    files.forEach(async (file) => {
      if (file.endsWith('.ts')) {
        const module = await import(path.join(modelsPath, file));
        const model = module.default || module;
        const initializedModel = model.init(this.connection);
        this.models[initializedModel.name] = initializedModel;
      }
    });

    Object.keys(this.models).forEach((modelName) => {
      if (this.models[modelName].associate) {
        this.models[modelName].associate(this.models);
      }
    });
  }
}

export const db = new Database().connection;
