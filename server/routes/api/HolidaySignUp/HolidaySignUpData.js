const router = require('express').Router();
const config = require('../../../config/connection');
const configAccounts = require('../../../config/connectionProductionCustom');
const sql = require('mssql');
const seq = require('sequelize');

async function getHolidays(holidayType) {
  let results = new Array();
  async function runQuery(query) {
    try {
      let result = await config.query(query, { replacements: { holidayType: holidayType }, type: seq.QueryTypes.SELECT });
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
    }
  }
  let query = `SELECT DISTINCT holiday FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] WHERE [holiday_type] = :holidayType`;

  results[0] = await runQuery(query);
  query = `SELECT DISTINCT employee_type FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] WHERE [holiday_type] = :holidayType`;

  results[1] = await runQuery(query);

  return results;
}

async function getHolidayData(holiday) {
  let query = `SELECT * FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] WHERE [holiday] = :holiday`;

  try {
    let result = await config.query(query, { replacements: { holiday: holiday }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getSignedUp(holiday) {
  let query = `SELECT * 
    FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
    LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
    WHERE [holiday] = :holiday
    ORDER BY [holiday_id] ASC`;

  try {
    let result = await config.query(query, { replacements: { holiday: holiday }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function runGetQuery(holidayType) {
  let query = `SELECT DISTINCT holiday FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] WHERE [holiday_type] = :holidayType`;

  try {
    let result = await config.query(query, { replacements: { holidayType: holidayType }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getAgents() {
  let query = `SELECT DISTINCT firstTable.[EmployeeID], firstTable.[Agent_Name], firstTable.[Office], firstTable.[JobTitle] , firstTable.[Permissions] , firstTable.[Active]
    FROM [Accounts].[dbo].[02_Agents] firstTable
    WHERE firstTable.[Active] = 'Current' AND (firstTable.[JobTitle] != 'N/A' AND firstTable.[JobTitle] != 'Manager')
    ORDER BY [Agent_Name]`;

  try {
    let result = await configAccounts.query(query, { type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function removeShiftData(id) {
  let query = `DELETE FROM [isapi].[dbo].[holidaySignUpTakenShifts] WHERE id = :shiftID`;

  try {
    let result = await config.query(query, { replacements: { shiftID: id }, type: seq.QueryTypes.DELETE });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getShifts(employeeType) {
  let query = `SELECT *
        FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable]
        WHERE [employee_type] = :employee
        ORDER BY [holiday] ASC`;
  try {
    let result = await config.query(query, { replacements: { employee: employeeType }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getSignedUp(accountNum, date) {
  let query = `SELECT takenShifts.id, holiday_id, agent_name, holiday, shift_time, holiday_type
        FROM [isapi].[dbo].[holidaySignUpTakenShifts] takenShifts
        LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] adminTable ON adminTable.[id] = takenShifts.[holiday_id]
        ORDER BY [holiday_type], [agent_name] ASC`;
  try {
    let result = await config.query(query, { replacements: { accountNum: accountNum, date: date }, type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function setShiftData(shiftData) {
  let query = `INSERT INTO [isapi].[dbo].[holidaySignUpTakenShifts] (holiday_id, agent_name) VALUES (${shiftData.holidayID}, :agentName);`;
  try {
    let result = await config.query(query, { replacements: { agentName: shiftData.agentName }, type: seq.QueryTypes.INSERT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function updateShiftData(shiftData) {
  let query = `UPDATE [isapi].[dbo].[holidaySignUpTakenShifts] SET agent_name = :agentName WHERE id=${shiftData.id}`;
  try {
    let result = await config.query(query, { replacements: { agentName: shiftData.agentName }, type: seq.QueryTypes.UPDATE });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

router.get('/GetAgents', async (req, res) => {
  results = await getAgents();
  res.json(results);
});

router.get('/GetHolidayData/:holiday', async (req, res) => {
  const holiday = req.params.holiday;
  results = await getHolidayData(holiday);
  res.json(results);
});

router.get('/GetSignedUp/:holiday', async (req, res) => {
  const holiday = req.params.holiday;
  results = await getSignedUp(holiday);
  res.json(results);
});

router.get('/Available/:date', async (req, res) => {
  results = await getHolidays();
  res.json(results);
});

router.get('/AgentView/:holidayType', async (req, res) => {
  const holidayType = req.params.holidayType;
  results = await runGetQuery(holidayType);
  res.json(results);
});

router.get('/:holidayType', async (req, res) => {
  const holidayType = req.params.holidayType;
  results = await getHolidays(holidayType);
  res.json(results);
});

router.post('/AssignShift', async (req, res) => {
  const shiftData = req.body;
  results = await setShiftData(shiftData);
  res.json(results);
});

router.put('/UpdateShift', async (req, res) => {
  const shiftData = req.body;
  results = await updateShiftData(shiftData);
  res.json(results);
});

router.delete('/RemoveShift/:shiftID', async (req, res) => {
  const shiftID = req.params.shiftID;
  results = await removeShiftData(shiftID);
  res.json(results);
});

module.exports = router;