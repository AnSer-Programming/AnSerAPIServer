const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT [clientNumber] ,Count([clientNumber]) AS 'Undelivered Messages'
      FROM [Intellegent].[dbo].[msgMessages] msg
      LEFT JOIN dbo.cltClients client ON client.cltId = msg.cltId
      WHERE [Delivered] = 0 AND msg.[cltId] IS NOT NULL AND msg.[Stamp] > DATEADD(month, -1, CURRENT_TIMESTAMP) 
      GROUP BY [clientNumber]
      ORDER BY [clientNumber] ASC`;

  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      res.json(result);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  })()

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

module.exports = router;