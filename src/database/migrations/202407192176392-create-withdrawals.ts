'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('withdrawals', {
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
        type: Sequelize.DECIMAL
      },
      fee: {
        allowNull: false,
        type: Sequelize.DECIMAL,
      },
      reference: {
        allowNull: false,
        type: Sequelize.STRING
      },
      account_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      account_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      bank_name: {
        allowNull: false,
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
    await queryInterface.dropTable('withdrawals');
  }
};