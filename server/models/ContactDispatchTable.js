const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/connection');

try {
  class ContactDispatchTable extends Model {}
  ContactDispatchTable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      account: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      api: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'contactDispatch',
    }
  );
  
  module.exports = ContactDispatchTable;
} catch(err) {
  console.log(`Model Error: ${ err }`);
}