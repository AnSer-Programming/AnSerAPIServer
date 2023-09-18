const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class CalendarShiftTable extends Model {}
  CalendarShiftTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      calendar_id: {
        type: DataTypes.INTEGER,
        allownull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time_start: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      time_end: {
        type: DataTypes.TIME,
        allowNull: false,
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
      modelName: 'calendarShifts',
    }
  );
  
  module.exports = CalendarShiftTable;
} catch(err) {
  console.log(`Calendar Model Error: ${ err }`);
}