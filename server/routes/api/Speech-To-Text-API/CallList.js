const router = require('express').Router();
const configCustom = require('../../../config/connectionProductionCustom');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const employeeName = req.query.EmployeeName;
  const clientNumber = req.query.ClientNumber;
  const date = req.query.Date;
  const endDate = req.query.EndDate; 
  let query = `EXEC spAIGenerateFileList :ClientNumber, :Employee, :Date, :EndDate`;
  let options = {
    Employee: null,
    ClientNumber: null,
    Date: null,
    EndDate: null
  };
  if(employeeName) {
    options.Employee = employeeName;
  }
  if(clientNumber) {
    options.ClientNumber = `${clientNumber}`;
  }
  if(date) {
    options.Date = date;
  }
  if(endDate) {
    options.EndDate = endDate; 
  }

  try {
    const seq = require('sequelize');
    let result = await configCustom.query(query, {
      replacements: options,
    raw: true 
  });

    res.json(result);
  } catch (err) {
    // ... error checks
    console.log(err);
    res.send("catch block: " + err);
  }

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
  // res.json({EmployeeName: employeeName, ClientNumber: clientNumber, Date: date, EndDate: endDate});
});

module.exports = router;