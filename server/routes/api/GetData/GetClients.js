const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT [ClientNumber], [ClientName], CONVERT(varchar, [Stamp]) as "Stamp"
        FROM [dbo].[cltClients]
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

router.get('/ByAccountNum/:accountNum', async (req, res) => {
  let accountNum = req.params.accountNum;
  const query = `SELECT [ClientNumber], [ClientName], CONVERT(varchar, [Stamp]) as "Stamp"
        FROM [dbo].[cltClients]
        WHERE [ClientNumber] LIKE '${accountNum}%'
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

router.get('/ByAccountName/:accountName', async (req, res) => {
  let accountName = req.params.accountName;
  const query = `SELECT [ClientNumber], [ClientName], CONVERT(varchar, [Stamp]) as "Stamp"
        FROM [dbo].[cltClients]
        WHERE [ClientName] LIKE '%${accountName}%'
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