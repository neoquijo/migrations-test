const sequelize = require('sequelize')

const up = async (queryInterface) => {
  await queryInterface.createTable('users', {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    balance: {
      type: sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
  });

  await queryInterface.bulkInsert('users', [{
    balance: 10000,
  }]);
};

const down = async (queryInterface) => {
  await queryInterface.dropTable('users');
};

module.exports = { up, down }