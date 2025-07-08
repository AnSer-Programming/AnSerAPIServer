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
  let query;
  if (holiday == "All") {
    query = `SELECT * FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable]`;
  } else {
    query = `SELECT * FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] WHERE [holiday] = :holiday`;
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

async function getDataForAgentView(holidayType, holiday) {
  let query;
  let parameterization;
  if (holiday == "All" || holiday == "None") {
    query = `SELECT agent_name, holiday, holiday_date, employee_type, shift_time
      FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
      LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
      WHERE [holiday_type] = :holidayType
      ORDER BY [holiday_id], [agent_name] ASC`;
    parameterization = { holidayType: holidayType };
  } else {
    query = `SELECT agent_name, holiday, holiday_date, employee_type, shift_time
      FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
      LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
      WHERE [holiday] = :holiday AND [holiday_type] = :holidayType
      ORDER BY [holiday_id], [agent_name] ASC`;
    parameterization = { holiday: holiday, holidayType: holidayType };
  }

  try {
    let result = await config.query(query, { replacements: parameterization, type: seq.QueryTypes.SELECT });
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

async function getAgents(agentType) {
  let query;
  if (agentType == "Agent") {
    query = `SELECT Agent_name, JobTitle, Dispatcher 
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND [JobTitle] = 'Agent'
      ORDER BY Agent_name`;
  } else if (agentType == "Dispatcher") {
    query = `SELECT Agent_name, JobTitle, Dispatcher 
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND [JobTitle] = 'Agent' AND [Dispatcher] = 1
      ORDER BY Agent_name`;
  } else if (agentType == "Supervisor") {
    query = `SELECT Agent_name, JobTitle, Dispatcher 
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND [JobTitle] = 'Supervisor'
      ORDER BY Agent_name`;
  } else {
    query = `SELECT Agent_name, JobTitle, Dispatcher 
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND ([JobTitle] = 'Agent' OR [JobTitle] = 'Supervisor')
      ORDER BY JobTitle, Dispatcher, Agent_name`;
  }

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

async function getSignedUp(holiday) {
  let query;
  if (holiday == 'All' || holiday == 'None') {
    query = `SELECT takenShifts.id, holiday_id, agent_name, holiday, shift_time, holiday_type
        FROM [isapi].[dbo].[holidaySignUpTakenShifts] takenShifts
        LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] adminTable ON adminTable.[id] = takenShifts.[holiday_id]
        WHERE [holiday] = :holiday
        ORDER BY [holiday_type], [agent_name] ASC`;
  } else {
    query = `SELECT takenShifts.id, holiday_id, agent_name, holiday, shift_time, holiday_type
        FROM [isapi].[dbo].[holidaySignUpTakenShifts] takenShifts
        LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] adminTable ON adminTable.[id] = takenShifts.[holiday_id]
        ORDER BY [holiday_type], [agent_name] ASC`;
  }
  
  try {
    let result = await config.query(query, { replacements: { holiday: holiday }, type: seq.QueryTypes.SELECT });
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

router.get('/GetAgents/:agentType', async (req, res) => {
  const agentType = req.params.agentType;
  results = await getAgents(agentType);
  res.json(results);
});

router.get('/GetAgentViewData/:holidayType/:holiday', async (req, res) => {
  const holidayType = req.params.holidayType;
  const holiday = req.params.holiday;
  results = await getDataForAgentView(holidayType, holiday);
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