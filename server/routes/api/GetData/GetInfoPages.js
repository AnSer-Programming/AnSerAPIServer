const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/:accountNum', async (req, res) => {
  let accountNum = req.params.accountNum;
  const query = `SELECT [OrderId], [Index], [Info], CONVERT(varchar, [Intellegent].[dbo].[cltInfo].[Stamp]) as "Stamp"
        FROM [dbo].[cltInfo]
        LEFT JOIN [Intellegent].[dbo].[cltClients] on [Intellegent].[dbo].[cltClients].[cltId] = [Intellegent].[dbo].[cltInfo].[cltId]
        WHERE [ClientNumber] = ${accountNum}
        ORDER BY [ClientNumber] ASC`;
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