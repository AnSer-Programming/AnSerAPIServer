const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/:accountNum', async (req, res) => {
  let accountNum = req.params.accountNum;
  let queryResults = new Array;
  let query = `SELECT [OrderId], [Index], [Info], CONVERT(varchar, [Intellegent].[dbo].[cltInfo].[Stamp]) as "Stamp"
        FROM [dbo].[cltInfo]
        LEFT JOIN [Intellegent].[dbo].[cltClients] on [Intellegent].[dbo].[cltClients].[cltId] = [Intellegent].[dbo].[cltInfo].[cltId]
        WHERE [ClientNumber] = :accountNum
        ORDER BY [OrderId] ASC`;

  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { replacements: { accountNum: accountNum }, type: seq.QueryTypes.SELECT });     
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  queryResults[0] = await runQuery();

  query = `SELECT [id]
      ,[Intellegent].[dbo].[dirListingFields].[cltId]
      ,[cltfieldID]
      ,[Field]
    FROM [Intellegent].[dbo].[dirListingFields]
    LEFT JOIN [Intellegent].[dbo].[cltClients] on [Intellegent].[dbo].[cltClients].[cltId] = [Intellegent].[dbo].[dirListingFields].[cltId]
    WHERE [ClientNumber] = :accountNum AND [Field] IS NOT NULL`;

  queryResults[1] = await runQuery();
  
  res.json(queryResults);

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

module.exports = router;