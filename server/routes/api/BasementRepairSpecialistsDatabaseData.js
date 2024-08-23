const router = require('express').Router();
const config = require('../../config/connectionProductionCustom');
const sql = require('mssql');

const dataBaseData = async() => {
  const query = `SELECT * FROM [Accounts].[dbo].[1028_Basement_Repair_Scheduled]`;
  let queryResults;
  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });
      console.log(result);
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  queryResults = await runQuery();

  sql.on('error', err => {
    // ... error handler
    console.log("sql on: " + err);
    return "Database Error in File BasementRepairSpecialistsDatabaseData.js";
  });

  return await queryResults;
}

module.exports = { dataBaseData };