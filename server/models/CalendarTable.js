const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class CalendarTable extends Model {}
  CalendarTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      calendar_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'calendar',
    }
  );
  
  module.exports = CalendarTable;
} catch(err) {
  console.log(`Calendar Model Error: ${ err }`);
}