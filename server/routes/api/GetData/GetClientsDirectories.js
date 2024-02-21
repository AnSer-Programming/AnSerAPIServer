const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT [ClientNumber], [ClientName], [Name] 
        FROM [dbo].[cltClients]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[cltClients].[subId] = [dbo].[dirSubjects].[subId]
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

router.get('/ByNumber/:accountNum', async (req, res) => {
  let accountNum = req.params.accountNum;
  const query = `SELECT [ClientNumber], [ClientName], [Name]
        FROM [dbo].[cltClients]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[cltClients].[subId] = [dbo].[dirSubjects].[subId]
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

router.get('/ByName/:accountName', async (req, res) => {
  let accountName = req.params.accountName;
  const query = `SELECT [ClientNumber], [ClientName], [Name]
        FROM [dbo].[cltClients]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[cltClients].[subId] = [dbo].[dirSubjects].[subId]
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

router.get('/ByDirectory/:directoryName', async (req, res) => {
  let directoryName = req.params.directoryName;
  const query = `SELECT [ClientNumber], [ClientName], [Name]
        FROM [dbo].[cltClients]
        INNER JOIN [dbo].[dirSubjects] ON [dbo].[cltClients].[subId] = [dbo].[dirSubjects].[subId]
        WHERE [Name] LIKE '%${directoryName}%'
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