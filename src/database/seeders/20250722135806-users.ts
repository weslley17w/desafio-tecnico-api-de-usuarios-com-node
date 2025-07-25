import { QueryInterface } from 'sequelize';
import { User } from '../models/index.js';
import { hash } from 'bcrypt';

interface Seed {
  up: (queryInterface: QueryInterface) => Promise<void>;
  down?: (queryInterface: QueryInterface) => Promise<void>;
}

const seed: Seed = {
  up: async (): Promise<void> => {
    await User.destroy({
      where: {},
    });
    const password: string = await hash('Senh@123', 10);
    await User.bulkCreate([
      {
        id: '09498a27-7006-48b5-8d6d-ba0a07792e24',
        name: 'João',
        email: 'joao@local.com',
        password,
      },
      {
        id: '221b7203-2c10-4027-b30f-7e5d74edf57c',
        name: 'Marcelo',
        email: 'marcelo@local.com',
        password,
      },
      {
        id: '4c46c68d-36f4-471e-9846-e34a61428bce',
        name: 'Tiago',
        email: 'tiago@local.com',
        password,
      },
    ]);
  },
  down: async (): Promise<void> => {
    const id: string[] = [
      '09498a27-7006-48b5-8d6d-ba0a07792e24',
      '221b7203-2c10-4027-b30f-7e5d74edf57c',
      '4c46c68d-36f4-471e-9846-e34a61428bce',
    ];

    await User.destroy({
      where: {
        id,
      },
    });
  },
};

module.exports = seed;
