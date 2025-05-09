const router = require('express').Router();
const config = require('../../../config/connection');
const sql = require('mssql');
const seq = require('sequelize');

async function getAccountNumbersAndDates() {
  let query = `SELECT DISTINCT [client_number], [date_added]
        FROM [isapi].[dbo].[monthlyClientSharedFieldsBackUp]
        ORDER BY [client_number] ASC`;
  try {
    let result = await config.query(query, { type: seq.QueryTypes.SELECT });     
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function runGetQuery(accountNum, date) {
  let query = `SELECT *
        FROM [isapi].[dbo].[monthlyClientSharedFieldsBackUp]
        WHERE client_number = :accountNum AND date_added = :date
        ORDER BY [client_shared_field_id] ASC`;
  try {
    let result = await config.query(query, { replacements: { accountNum: accountNum, date: date }, type: seq.QueryTypes.SELECT });     
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

router.get('/', async(req, res) => {
  results = await getAccountNumbersAndDates();
  res.json(results);
});

router.get('/:accountNum/:date', async(req, res) => {
  accountNum = req.params.accountNum;
  date = req.params.date;
  results = await runGetQuery(accountNum, date);
  console.log(results);
  res.json(results);
});

module.exports = router;