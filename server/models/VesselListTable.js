const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class VesselListTable extends Model {}
  VesselListTable.init(
    {
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vessel_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_num: {
        type: DataTypes.BIGINT,
        allowNull: false,
      }
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'vesselList',
    }
  );
  
  module.exports = VesselListTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}