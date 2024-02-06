const router = require('express').Router();
const config = require('../../../config/connectionProductionCustom');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT Employee.Agent_name as 'Agent', Employee.Office, EmployeeList.Agent_Name as 'Supervisor', Auxiliary.ID, Auxiliary.EmployeeID as 'EmployeeIDSup', isnull(Auxiliary.Value,Employee.EmployeeID) as 'EmployeeIDAgt'
              FROM AnSerTimecard.dbo.EmployeeList Employee
              LEFT JOIN AnSerTimecard.dbo.Auxiliary Auxiliary on Employee.EmployeeID = Auxiliary.Value
              LEFT JOIN AnSerTimecard.dbo.EmployeeList EmployeeList on Auxiliary.EmployeeID = EmployeeList.EmployeeID
              WHERE Employee.active = 'Current'
                    and (Auxiliary.Active is null or Auxiliary.Active = 1)
                    and (Auxiliary.FieldID is null or Auxiliary.FieldID = 2)
                    and Employee.JobTitle = 'Agent'
              ORDER by Employee.Agent_Name
  `;
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