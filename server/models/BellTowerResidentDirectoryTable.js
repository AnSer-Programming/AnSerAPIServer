const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class BellTowerResidentDirectoryTable extends Model {}
  BellTowerResidentDirectoryTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      resident_full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resident_room_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resident_phone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'bellTowerResidentDirectory',
    }
  );
  
  module.exports = BellTowerResidentDirectoryTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}