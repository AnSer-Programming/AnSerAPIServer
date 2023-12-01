const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT [agtId], [Name], CONVERT(varchar, [Stamp]) as "Stamp", [Initials]
        FROM [dbo].[agtAgents]
        ORDER BY [agtId] ASC`;
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

router.get('/ByAgentID/:agtID', async (req, res) => {
  let agtID = req.params.agtID;
  const query = `SELECT [agtId], [Name], CONVERT(varchar, [Stamp]) as "Stamp", [Initials]
        FROM [dbo].[agtAgents]
        WHERE [agtId] = '${agtID}'
        ORDER BY [agtId] ASC`;

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

router.get('/ByAgentName/:agtName', async (req, res) => {
  let agtName = req.params.agtName;
  const query = `SELECT [agtId], [Name], CONVERT(varchar, [Stamp]) as "Stamp", [Initials]
        FROM [dbo].[agtAgents]
        WHERE [Name] LIKE '%${agtName}%'
        ORDER BY [agtId] ASC`;
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