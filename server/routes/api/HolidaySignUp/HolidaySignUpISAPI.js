const router = require('express').Router();
const config = require('../../../config/connection');
const configAccounts = require('../../../config/connectionProductionCustom');
const sql = require('mssql');
const seq = require('sequelize');
const { findShifts } = require('../../../utils/holidaySignUpHelper/holidaySignUpShiftLogic');

async function deleteShift(id) {
  let query = `DELETE FROM [isapi].[dbo].[holidayShiftPicker] WHERE id = :shiftID`;

  try {
    let result = await config.query(query, { replacements: { shiftID: id }, type: seq.QueryTypes.DELETE });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getHolidays() {
  let results;
  async function runQuery(query) {
    try {
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
    }
  }
  let query = `SELECT DISTINCT holiday, holiday_date FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] ORDER BY [holiday_date] ASC`;

  results = await runQuery(query);

  return results;
}

async function getHolidayData(holiday) {
  let query;
  if (holiday == "All") {
    query = `SELECT * FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable]`;
  } else {
    query = `SELECT * FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] WHERE [holiday] = :holiday AND [employee_type] = 'Agent'`;
  }

  try {
    let result = await config.query(query, { replacements: { holiday: holiday }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getSignedUp(holiday) {
  let query;
  if (holiday == 'Summer' || holiday == 'Winter') {
    query = `SELECT signedUp.id, holiday_id, agent_name, holiday, holiday_date, employee_type, shift_time, number_of_shifts 
      FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
      LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
      WHERE [holiday_type] = :holiday
      ORDER BY [holiday_id], [agent_name] ASC`;
  } else {
    query = `SELECT signedUp.id, holiday_id, agent_name, holiday, holiday_date, employee_type, shift_time, number_of_shifts 
      FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
      LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
      WHERE [holiday] = :holiday
      ORDER BY [holiday_id] ASC`;
  }

  try {
    let result = await config.query(query, { replacements: { holiday: holiday }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getAgentShifts(employee_id) {
  let query = `SELECT shiftPicker.id, holiday_id, holiday, holiday_date, employee_type, shift_time, number_of_shifts, pick_number 
      FROM [isapi].[dbo].[holidayShiftPicker] shiftPicker
      LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON shiftPicker.[holiday_id] = holidays.[id]
      WHERE [employee_id] = :employee_id
      ORDER BY [pick_number]`;

  try {
    let result = await config.query(query, { replacements: { employee_id: employee_id }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

router.get('/getAvailableHolidays', async(req, res) => {
  let holidays = await getHolidays();
  let holidaysConcat = new Array();
  for(let i = 0; i < holidays.length; i++) {
    holidaysConcat[i] = {holiday: `${holidays[i].holiday} ${holidays[i].holiday_date}`, holidayName: `${holidays[i].holiday}`};
  }

  res.json(holidaysConcat);
});

router.get('/getAvailableShifts/:holiday', async(req, res) => {
  let takenShifts = await getSignedUp(`${req.params.holiday}`);
  let shifts = await getHolidayData(`${req.params.holiday}`);
  let schedule = await findShifts(shifts, takenShifts, -1);
  
  res.json(schedule);
});

router.get('/getAvailableShifts/:holiday/:primaryShiftID', async(req, res) => {
  let takenShifts = await getSignedUp(`${req.params.holiday}`);
  let shifts = await getHolidayData(`${req.params.holiday}`);
  let schedule = await findShifts(shifts, takenShifts, `${req.params.primaryShiftID}`);
  
  res.json(schedule);
});

router.get('/getMyShifts/:employeeID', async(req, res) => {
  const employeeID = req.params.employeeID;
  const results = await getAgentShifts(employeeID);

  if(results[0].pick_number == 2) {
    results[1] = results[0];
    results[0] = {id: -1};
  }

  console.log(results);

  res.json(results);
});

router.get('/getMyShiftsDropDown/:employeeID', async(req, res) => {
  const employeeID = req.params.employeeID;
  const results = await getAgentShifts(employeeID);
  let concatOptions = new Array();

  console.log(results);

  for(let i = 0; i < results.length; i++) {
    concatOptions[i] = {id: `${results[i].id}`, label: `${results[i].holiday_date} AT ${results[i].shift_time}`, holidayID: `${results[i].holiday_id}`}
  }

  console.log(concatOptions);

  res.json(concatOptions);
});

router.post('/pickShift', async(req, res) => {
  const data = req.body;
  res.json({return: "No Shifts To Assign"});
});

router.put('/changeShift', async(req, res) => {
  const data = req.body;
  res.json({return: "No Shifts To Change"});
});

router.delete('/deleteShift/:shiftID', async(req, res) => {
  const shiftID = req.params.shiftID;
  const results = deleteShift(shiftID);
  res.json(results);
});

module.exports = router;