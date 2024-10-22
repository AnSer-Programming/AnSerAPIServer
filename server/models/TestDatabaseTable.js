const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class TestDatabaseTable extends Model {}
  TestDatabaseTable.init(
    {
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      account_num: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      favorite_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      favorite_animal: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'testDatabase',
    }
  );
  
  module.exports = TestDatabaseTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}