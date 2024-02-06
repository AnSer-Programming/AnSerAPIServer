const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class ResidentDirectoryTable extends Model {}
  ResidentDirectoryTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      resident_full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resident_room_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resident_phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'residentDirectory',
    }
  );
  
  module.exports = ResidentDirectoryTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}