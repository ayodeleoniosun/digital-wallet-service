'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deposits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false
      },
      amount: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      reference: {
        allowNull: false,
        type: Sequelize.STRING
      },
      source: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['bank_transfer', 'card']
      },
      account_number: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      account_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      bank_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      last_4_digits: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      auth_token: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('deposits');
  }
};