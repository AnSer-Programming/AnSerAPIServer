const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class DIDTable extends Model {}
  DIDTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      phone_number: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      thinq: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      pulsar: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      nsight: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      amtelco: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'didSources',
    }
  );
  
  module.exports = DIDTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}