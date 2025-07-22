import { DataTypes, QueryInterface } from 'sequelize';

interface Migration {
  up: (queryInterface: QueryInterface) => Promise<void>;
  down?: (queryInterface: QueryInterface) => Promise<void>;
}

const migration: Migration = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('users');
  },
};

module.exports = migration;
