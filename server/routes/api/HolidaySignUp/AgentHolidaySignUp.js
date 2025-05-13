const router = require('express').Router();
const config = require('../../../config/connection');
const sql = require('mssql');
const seq = require('sequelize');

async function getShifts() {
  let query = `SELECT *
        FROM [isapi].[dbo].[holidaysShiftSignUpAdminTable]
        WHERE [employee_type] = 'Agent'
        ORDER BY [holiday] ASC`;
  try {
    let result = await config.query(query, { type: seq.QueryTypes.SELECT });     
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getSignedUp(accountNum, date) {
  let query = `SELECT takenShifts.id, holiday_id, agent_name, holiday, shift_time, holiday_type
        FROM [isapi].[dbo].[holidaySignUpTakenShifts] takenShifts
        LEFT JOIN [isapi].[dbo].[holidaysShiftSignUpAdminTable] adminTable ON adminTable.[id] = takenShifts.[holiday_id]
        WHERE [employee_type] = 'Agent'
        ORDER BY [holiday_type], [agent_name] ASC`;
  try {
    let result = await config.query(query, { replacements: { accountNum: accountNum, date: date }, type: seq.QueryTypes.SELECT });     
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function postSignedUp() {

}

async function updateSignedUp() {

}

router.get('/', async(req, res) => {
  results = await getShifts();
  res.json(results);
});

router.get('/SignedUp', async(req, res) => {
  accountNum = req.params.accountNum;
  date = req.params.date;
  results = await runGetQuery(accountNum, date);
  res.json(results);
});

module.exports = router;