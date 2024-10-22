const router = require('express').Router();
const config = require('../../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT [ClientName]
        ,SubjectTable.[Name] as directory_name
      FROM [Intellegent].[dbo].[cltClients] ClientTable
      LEFT JOIN [Intellegent].[dbo].[dirSubjects] SubjectTable ON ClientTable.[subId] = SubjectTable.[subId]
      LEFT JOIN [Intellegent].[dbo].[dirStatusOverrides] OverrideTable ON OverrideTable.[subID] = SubjectTable.[subId]
      WHERE SubjectTable.[Name] IS NOT NULL AND OverrideTable.[Name] IS NULL
      ORDER BY SubjectTable.[Name] ASC`;

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