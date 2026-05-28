const configAPI = require('../../config/connection');
const sql = require('mssql');
const seq = require('sequelize');

async function main() {
  let query = `SELECT * FROM [isapi].[dbo].[qgendaProviders]`;

  try {
    let result = await configAPI.query(query, { type: seq.QueryTypes.SELECT });     
    return result;
  } catch (err) {
    // ... error checks
    return (err);
  }
}

return main();