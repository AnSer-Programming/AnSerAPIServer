const config = require('../config/connectionProductionIS');
const sql = require('mssql');

async function main() {
  const query = `SELECT [clientNumber] ,Count([clientNumber]) AS undeliveredMessages
  FROM [Intellegent].[dbo].[msgMessages] msg
  LEFT JOIN dbo.cltClients client ON client.cltId = msg.cltId
  WHERE [Delivered] = 0 AND msg.[cltId] IS NOT NULL AND msg.[Stamp] > DATEADD(month, -1, CURRENT_TIMESTAMP) 
  GROUP BY [clientNumber]
  ORDER BY [clientNumber] ASC`;

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