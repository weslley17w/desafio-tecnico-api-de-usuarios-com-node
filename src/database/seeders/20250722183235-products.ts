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
      {
        title: 'Licensed Soft Chair',
        description: 'The Football Is Good For Training And Recreational Purposes',
        price: 1222.2,
        created_by: '09498a27-7006-48b5-8d6d-ba0a07792e24',
      },
      {
        title: 'Incredible Concrete Fish',
        description: 'The Nagasaki Lander Is The Trademarked Name Of Several...',
        price: 1222.2,
        created_by: '09498a27-7006-48b5-8d6d-ba0a07792e24',
      },
      {
        title: 'Rustic Metal Bike',
        description:
          'Boston’s most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles',
        price: 1222.2,
        created_by: '09498a27-7006-48b5-8d6d-ba0a07792e24',
      },
      {
        title: 'Gorgeous Plastic Shoes',
        description:
          'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
        price: 1222.2,
        created_by: '09498a27-7006-48b5-8d6d-ba0a07792e24',
      },
      {
        title: 'Handcrafted Wooden Pants',
        description:
          'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
        price: 1222.2,
        created_by: '09498a27-7006-48b5-8d6d-ba0a07792e24',
      },
      {
        title: 'Ergonomic Steel Table',
        description: 'The Nagasaki Lander Is The Trademarked Name Of Several...',
        price: 1222.2,
        created_by: '09498a27-7006-48b5-8d6d-ba0a07792e24',
      },
    ]);
  },
  down: async (): Promise<void> => {},
};

module.exports = seed;
