const router = require('express').Router();
const config = require('../../../../config/connectionProductionIS');
const sql = require('mssql');
const { groupCheck } = require('../../../../utils/groupCheckIS');

router.get('/', async (req, res) => {
  const query = `SELECT 
    client.[cltId], client.[ClientNumber], client.[ClientName], directories.[Name] AS directoryName, client.[subId], directoryViews.[Name] AS viewName, 
      pmView.[viewId], pmView.[pmId], groups.[Name] AS groupName
  FROM [Intellegent].[dbo].[cltClients] client
  LEFT JOIN [Intellegent].[dbo].[dirSubjects] directories ON directories.[subId] = client.[subId]
  LEFT JOIN [Intellegent].[dbo].[dirViews] directoryViews ON directories.[subId] = directoryViews.[subId]
  LEFT JOIN [Intellegent].[dbo].[pmViews] pmView ON directoryViews.[viewId] = pmView.[viewId]
  LEFT JOIN [Intellegent].[dbo].[pmPermissionGroups] groups ON groups.[pmId] = pmView.[pmId]
  WHERE client.[subId] IS NOT NULL
  ORDER BY directoryName, viewName, groupName ASC`;

  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      res.json(await groupCheck(result));
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  runQuery();

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

module.exports = router;