import { QueryInterface } from 'sequelize';
import { Product } from '../models/index.js';

interface Seed {
  up: (queryInterface: QueryInterface) => Promise<void>;
  down?: (queryInterface: QueryInterface) => Promise<void>;
}

const seed: Seed = {
  up: async (): Promise<void> => {
    await Product.bulkCreate([
      {
        title: 'Handmade Fresh Table',
        description: 'Andy shoes are designed to keeping in...',
        price: 1222.2,
        created_by: '09498a27-7006-48b5-8d6d-ba0a07792e24',
      },
    ]);
  },
  down: async (): Promise<void> => {},
};

module.exports = seed;
