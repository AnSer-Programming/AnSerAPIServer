const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class CrescentElectricTable extends Model {}
  CrescentElectricTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      branch: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      primary_contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      secondary_contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tertiary_contact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quaternary_contact: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'crescentElectricEscalationList',
    }
  );
  
  module.exports = CrescentElectricTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}