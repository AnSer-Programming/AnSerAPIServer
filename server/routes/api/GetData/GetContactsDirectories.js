const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT DISTINCT [Name], [Field]
        FROM [Intellegent].[dbo].[dirViewFields]
        LEFT JOIN [dbo].[dirListingFields] ON [dbo].[dirViewFields].[subfieldId] = [dbo].[dirListingFields].[subfieldId]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[dirSubjects].[subId] = [dbo].[dirListingFields].[subId]
        WHERE [Title] = 'Name'`;
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

router.get('/ByDirectoryName/:directoryName', async (req, res) => {
  let directoryName = req.params.directoryName;
  const query = `SELECT DISTINCT [Name], [Field]
        FROM [Intellegent].[dbo].[dirViewFields]
        LEFT JOIN [dbo].[dirListingFields] ON [dbo].[dirViewFields].[subfieldId] = [dbo].[dirListingFields].[subfieldId]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[dirSubjects].[subId] = [dbo].[dirListingFields].[subId]
        WHERE [Title] = 'Name' AND [Name] LIKE '%${directoryName}%'`;
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

router.get('/ByPersonName/:personName', async (req, res) => {
  let personName = req.params.personName;
  const query = `SELECT DISTINCT [Name], [Field]
        FROM [Intellegent].[dbo].[dirViewFields]
        LEFT JOIN [dbo].[dirListingFields] ON [dbo].[dirViewFields].[subfieldId] = [dbo].[dirListingFields].[subfieldId]
        LEFT JOIN [dbo].[dirSubjects] ON [dbo].[dirSubjects].[subId] = [dbo].[dirListingFields].[subId]
        WHERE [Title] = 'Name' AND [Field] LIKE '%${personName}%'`;
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