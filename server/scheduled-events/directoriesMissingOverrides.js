const config = require('../config/connectionProductionIS');
const sql = require('mssql');

async function main() {
  const query = `SELECT [ClientName]
        ,SubjectTable.[Name] as directory_name
      FROM [Intellegent].[dbo].[cltClients] ClientTable
      LEFT JOIN [Intellegent].[dbo].[dirSubjects] SubjectTable ON ClientTable.[subId] = SubjectTable.[subId]
      LEFT JOIN [Intellegent].[dbo].[dirStatusOverrides] OverrideTable ON OverrideTable.[subID] = SubjectTable.[subId]
      WHERE SubjectTable.[Name] IS NOT NULL AND OverrideTable.[Name] IS NULL
      ORDER BY SubjectTable.[Name] ASC`;

  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      return ("catch block: " + err);
    }
  }

  sql.on('error', err => {
    // ... error handler
    return ("sql on: " + err);
  })
  const queryResults = await runQuery();

  // console.log(queryResults);
  return await queryResults;
}

module.exports = main;