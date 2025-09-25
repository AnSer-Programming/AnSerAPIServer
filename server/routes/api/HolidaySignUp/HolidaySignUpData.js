const router = require('express').Router();
const config = require('../../../config/connection');
const configAccounts = require('../../../config/connectionProductionCustom');
const sql = require('mssql');
const seq = require('sequelize');
const { buildSchedule } = require('../../../utils/holidaySignUpHelper/holidaySignUpShiftAssigner');
const sendBreakReportEmail = require('../../../node-mailer/AgentSuccess/automationBreakReport');
const sendSuccessReportEmail = require('../../../node-mailer/AgentSuccess/automationSuccessReport');

async function getAgentSignUpReport() {
  let results;
  let query = `SELECT [employee_id], [pick_number], [holiday], [holiday_date], [shift_time]
          FROM [isapi].[dbo].[holidayShiftPicker] hsp
          LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] hssua ON hsp.[holiday_id] = hssua.[id]
          ORDER BY hsp.[id], pick_number`;
  try{
    results = await config.query(query,{type:seq.QueryTypes.SELECT});
    return results;
  } catch(err) {
    console.log(err);
  }
}

async function getShiftData(shiftID) {
  let results;
  let query = `SELECT holiday, holiday_date, shift_time
          FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable]
          WHERE [id] = :shiftID`;
  try {
    results = await config.query(query, { replacements: { shiftID: shiftID }, type: seq.QueryTypes.SELECT });
    return results;
  } catch (err) {
    console.log(err);
  }
}

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
  let query = `SELECT DISTINCT holiday, holiday_date FROM [isapi].[dbo].[holidayShiftsSignUpAdminTable] WHERE [holiday_type] = :holidayType ORDER BY [holiday_date] ASC`;

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
    query = `SELECT signedUp.id, holiday_id, agent_name, holiday, holiday_date, employee_type, shift_time, number_of_shifts, agent_office 
      FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
      LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
      WHERE [holiday_type] = :holiday
      ORDER BY [holiday_id], [agent_name] ASC`;
  } else {
    query = `SELECT signedUp.id, holiday_id, agent_name, holiday, holiday_date, employee_type, shift_time, number_of_shifts, agent_office 
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
    query = `SELECT EmployeeID, Agent_name, JobTitle, Dispatcher, Office
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND [JobTitle] = 'Agent' AND [ScheduleGroup] = 'Amtelco Agent' AND [Office] != 'Overnight' AND [Dispatcher] = 0
      ORDER BY Agent_name`;
  } else if (agentType == "Dispatcher") {
    query = `SELECT EmployeeID, Agent_name, JobTitle, Dispatcher, Office
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND [JobTitle] = 'Agent' AND [Dispatcher] = 1 AND [ScheduleGroup] = 'Amtelco Agent' AND [Office] != 'Overnight'
      ORDER BY Agent_name`;
  } else if (agentType == "Supervisor") {
    query = `SELECT EmployeeID, Agent_name, JobTitle, Dispatcher, Office
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND [JobTitle] = 'Supervisor' AND [ScheduleGroup] = 'Amtelco Supervisor' AND [Office] != 'Overnight'
      ORDER BY Agent_name`;
  } else {
    query = `SELECT EmployeeID, Agent_name, JobTitle, Dispatcher, Office
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND ([JobTitle] = 'Agent' OR [JobTitle] = 'Supervisor') AND ([ScheduleGroup] = 'Amtelco Agent' OR [ScheduleGroup] = 'Amtelco Supervisor') AND [Office] != 'Overnight'
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

async function setShiftData(shiftData) {
  let query = `INSERT INTO [isapi].[dbo].[holidaySignUpTakenShifts] (holiday_id, agent_name, agent_office) VALUES :shiftData`;
  //{ replacements: { holidayID: shiftData.holiday_id, agentName: shiftData.agentName }
  try {
    let result = await config.query(query, { replacements: { shiftData: shiftData }, type: seq.QueryTypes.INSERT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getAgentsBySenority() {
  let results = new Array();
  let query = new Array();

  query[0] = `SELECT EmployeeID, Agent_name, JobTitle, Dispatcher, CONVERT(Date, StartStamp) as 'start_date', Office
      FROM AnSerTimecard.dbo.EmployeeList 
      WHERE [Active] = 'Current' AND [JobTitle] = 'Agent' AND [ScheduleGroup] = 'Amtelco Agent' AND [Office] != 'Overnight' AND [Dispatcher] = 0
      ORDER BY StartStamp, EmployeeID ASC`;

  query[1] = `SELECT *
        FROM [isapi].[dbo].[OfficeInformation]`;

  try {
    results[0] = await configAccounts.query(query[0], { type: seq.QueryTypes.SELECT });
    results[1] = await config.query(query[1], { type: seq.QueryTypes.SELECT });
  } catch (err) {
    // ... error checks
    console.log(err);
  }

  return await results;
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

async function getRequestedShifts() {
  let query = `SELECT * FROM [isapi].[dbo].[holidayShiftPicker]`;

  try {
    let result = await config.query(query, { type: seq.QueryTypes.SELECT });
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getAssignedShifts(agentName) {
  let query;

  try {
    let result;
    if (agentName == 'All') {
      query = `SELECT signedUp.id, holiday_id, agent_name, holiday, holiday_date, employee_type, shift_time, number_of_shifts 
        FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
        LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
        ORDER BY [holiday_id], [agent_name] ASC`;
      result = await config.query(query, { type: seq.QueryTypes.SELECT });
    } else {
      query = `SELECT signedUp.id, holiday_id, agent_name, holiday, holiday_date, employee_type, shift_time, number_of_shifts 
        FROM [isapi].[dbo].[holidaySignUpTakenShifts] signedUp
        LEFT JOIN [isapi].[dbo].[holidayShiftsSignUpAdminTable] holidays ON signedUp.[holiday_id] = holidays.[id]
        WHERE [agent_name] = :agentName
        ORDER BY [holiday_id] ASC`;
      result = await config.query(query, { replacements: { agentName: agentName }, type: seq.QueryTypes.SELECT });
    }
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function getNotYetSignedUp() {
  let agents = await getAgents("Agent");
  let pickedShifts = await getRequestedShifts();
  let notYetSignedUp = new Array();
  let isFound = false;

  for (let x = 0; x < agents.length; x++) {
    isFound = false;
    for (let y = 0; y < pickedShifts.length; y++) {
      if (agents[x].EmployeeID == pickedShifts[y].employee_id) {
        isFound = true;
        break;
      }
    }
    if (!isFound) {
      notYetSignedUp.push(agents[x]);
    }
  }

  return (notYetSignedUp);
}

//Get
router.get('/TestAutoAssign/:startPoint', async (req, res) => {
  let start = req.params.startPoint;
  let roundNumber = 1;
  let agents = await getAgentsBySenority();
  let takenShifts = await getSignedUp('Winter');
  let shifts = await getHolidayData('All');
  let requestedShifts = await getRequestedShifts();
  let schedule = await buildSchedule(agents, requestedShifts, shifts, takenShifts, roundNumber, start);
  let shiftData;
  let overviewByOfficeForAgents = {};
  let count = 0;

  for (let i = 0; i < schedule.setShifts.length; i++) {
    shiftData = await getShiftData(schedule.setShifts[i][0]);
    for (let key in shiftData[0]) {
      schedule.setShifts[i] += `,${shiftData[0][`${key}`]}`;
    }
    schedule.setShifts[i] = await schedule.setShifts[i].split(',');
  }

  for(let key in schedule.overviewByOffice) {
    count = 0;
    overviewByOfficeForAgents[`${key}`] = new Array();
    for(let i = 0; i < schedule.overviewByOffice[`${key}`].length; i ++) {
      if(schedule.overviewByOffice[`${key}`][i].employeeType=="Agent") {
        overviewByOfficeForAgents[`${key}`][count] = await schedule.overviewByOffice[`${key}`][i];
        count++;
      }
    }
  }

  let agentSignUpReport = await getAgentSignUpReport();

  for(let x = 0; x < agentSignUpReport.length; x++) {
    isFound = false;
    for(let y = 0; y < agents[0].length; y++) {
      if(agentSignUpReport[x].employee_id == agents[0][y].EmployeeID) {
        agentSignUpReport[x]['employee_name'] = await agents[0][y].Agent_name;
        agentSignUpReport[x]['office_location'] = await agents[0][y].Office;
        isFound = true;
      }
    }
    if(!isFound) {
      agentSignUpReport.splice(x, 1);
      x-=1;
    }
  }

  if(schedule.scheduleBuild) {
    sendSuccessReportEmail({schedule: schedule.setShifts, shiftPicks: agentSignUpReport});
  }

  res.json({OverviewByOffice: overviewByOfficeForAgents, OverviewByShift: schedule.overviewData, AgentSignUpReport: agentSignUpReport});
});

router.get('/AssignShifts/:roundNumber/:startPoint', async (req, res) => {
  let start = req.params.startPoint;
  let roundNumber = req.params.roundNumber;
  let agents = await getAgentsBySenority();
  let takenShifts = await getSignedUp('Winter');
  let shifts = await getHolidayData('All');
  let requestedShifts = await getRequestedShifts();
  let schedule = await buildSchedule(agents, requestedShifts, shifts, takenShifts, roundNumber, start);
  let shiftData;

  if (schedule.setShifts.length < 1) {
    results = { error: "No Available Data, check email for automation error report." }
  } else {
    results = await setShiftData(schedule.setShifts);
  }

  for (let i = 0; i < schedule.setShifts.length; i++) {
    shiftData = await getShiftData(schedule.setShifts[i][0]);
    for (let key in shiftData[0]) {
      schedule.setShifts[i] += `,${shiftData[0][`${key}`]}`;
    }
    schedule.setShifts[i] = await schedule.setShifts[i].split(',');
  }

  sendSuccessReportEmail(schedule.setShifts);

  res.json(results);
});

router.get('/GetNotYetSignedUp', async (req, res) => {
  results = await getNotYetSignedUp();
  res.json(results);
});

router.get('/GetAgents/BySenority', async (req, res) => {
  results = await getAgentsBySenority();
  res.json(results);
});

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

router.get('/AgentSignUpReport/:agentName', async (req, res) => {
  const agentName = req.params.agentName;
  results = await getAssignedShifts(agentName);
  res.json(results);
})

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

router.get('/AgentView/:holidayType', async (req, res) => {
  const holidayType = req.params.holidayType;
  results = await runGetQuery(holidayType);
  res.json(results);
});

router.get('/:holidayType', async (req, res) => {
  const holidayType = req.params.holidayType;
  let placeHolder;
  let sorted = false;
  results = await getHolidays(holidayType);

  while (!sorted) {
    sorted = true;
    for (let x = 0; x < results[0].length - 1; x++) {
      if (results[0][x].holiday_date.split('-')[2] > results[0][x + 1].holiday_date.split('-')[2]) { // year x-1 > year x
        for (let y = x; y >= 0; y--) {
          placeHolder = results[0][y];
          results[0][y] = results[0][y + 1];
          results[0][y + 1] = placeHolder;
        }
        sorted = false;
      } else if (results[0][x].holiday_date.split('-')[2] == results[0][x + 1].holiday_date.split('-')[2]) { // year x-1 = year x
        if (results[0][x].holiday_date.split('-')[0] > results[0][x + 1].holiday_date.split('-')[0]) { // month x-1 > month x
          for (let y = x; y >= 0; y--) {
            placeHolder = results[0][y];
            results[0][y] = results[0][y + 1];
            results[0][y + 1] = placeHolder;
          }
          sorted = false;
        } else if (results[0][x].holiday_date.split('-')[0] == results[0][x + 1].holiday_date.split('-')[0]) { // month x-1 = month x
          if (results[0][x].holiday_date.split('-')[1] > results[0][x + 1].holiday_date.split('-')[1]) { // day x-1 > day x
            for (let y = x; y >= 0; y--) {
              placeHolder = results[0][y];
              results[0][y] = results[0][y + 1];
              results[0][y + 1] = placeHolder;
            }
            sorted = false;
          }
        }
      }
    }
  }

  res.json(results);
});

//POST
router.post('/AssignShift', async (req, res) => {
  const shiftData = req.body;
  results = await setShiftData([shiftData]);
  res.json(results);
});

//PUT
router.put('/UpdateShift', async (req, res) => {
  const shiftData = req.body;
  results = await updateShiftData(shiftData);
  res.json(results);
});

//DELETE
router.delete('/RemoveShift/:shiftID', async (req, res) => {
  const shiftID = req.params.shiftID;
  results = await removeShiftData(shiftID);
  res.json(results);
});

module.exports = router;