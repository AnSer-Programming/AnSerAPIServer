const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class OnTimeTable extends Model {}
  OnTimeTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'onTime',
    }
  );
  
  module.exports = OnTimeTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}