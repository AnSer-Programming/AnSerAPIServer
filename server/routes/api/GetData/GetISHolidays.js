const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT *
        FROM [dbo].[sysHolidays]
        ORDER BY [holidayId] ASC`;
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
  const query = `SELECT holidays.[holidayId], [Name], holidays.[Start], holidays.[End]
        FROM [Intellegent].[dbo].[cltHolidays] cltHoliday
        LEFT JOIN [Intellegent].[dbo].[cltClients] clients ON cltHoliday.[cltId] = clients.[cltId]
        LEFT JOIN [Intellegent].[dbo].[sysHolidays] holidays ON cltHoliday.[holidayId] = holidays.[holidayId]
        WHERE [ClientNumber] LIKE :accountNum
        ORDER BY [ClientNumber] ASC`;

  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { replacements: { accountNum: `${accountNum}` }, type: seq.QueryTypes.SELECT });

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
  const query = `SELECT [ClientNumber], [ClientName], CONVERT(varchar, [Stamp]) as "Stamp", [AnswerPhrase]
        FROM [dbo].[cltClients]
        WHERE [ClientName] LIKE :accountName
        ORDER BY [ClientNumber] ASC`;
  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { replacements: { accountName: `%${accountName}%` }, type: seq.QueryTypes.SELECT });

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