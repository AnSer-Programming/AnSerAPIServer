const { shiftTimeTwelveHourToTwentyFourHour } = require('../timeHandler');
const sendBreakReportEmail = require('../../node-mailer/AgentSuccess/automationBreakReport');

async function buildSchedule(agents, requestedShifts, shifts, savedShifts, roundNumber, start) {
  let newStart
  let takenShifts = savedShifts;
  let takenCounter;
  let overviewData = {};
  let setShifts = new Array();
  let agentList = agents[0];
  let overviewByOffice = {};
  let offices = agents[1];

  for (let x = 0; x < offices.length; x++) {
    overviewByOffice[`${offices[x].Office}`] = new Array();
    for (let y = 0; y < shifts.length; y++) {
      overviewByOffice[`${offices[x].Office}`][y] = {
        shiftID: shifts[y].id,
        shiftDate: shifts[y].holiday_date,
        shiftTime: shifts[y].shift_time,
        employeeType: shifts[y].employee_type,
        shiftTimeRaw: shiftTimeTwelveHourToTwentyFourHour(shifts[y].shift_time),
        totalShifts: shifts[y].number_of_shifts,
        totalAgents: 0
      };
    }
  }

  for (let x = 0; x < takenShifts.length; x++) {
    for (let y = 0; y < overviewByOffice[`${takenShifts[x].agent_office}`].length; y++) {
      // Limit to the same date between the overview and the stored data
      if (overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftDate == takenShifts[x].holiday_date) {
        // Limit to the same employee level between overview and stored data
        if (overviewByOffice[`${takenShifts[x].agent_office}`][y].employeeType == takenShifts[x].employee_type) {
          if (parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[0]) < await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[0])) {
            if (parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[1]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[1]) &&
              parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[0])) {
              overviewByOffice[`${takenShifts[x].agent_office}`][y].totalAgents += 1;
            }
          } else if (parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[0]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[0])) {
            if (parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[0]) < await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[1]) &&
              parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[0])) {
              overviewByOffice[`${takenShifts[x].agent_office}`][y].totalAgents += 1;
            }
          }
        }
      }
    }
  }

  for (let x = 0; x < shifts.length; x++) {
    takenCounter = 0;
    for (let y = 0; y < takenShifts.length; y++) {
      if (shifts[x].id == takenShifts[y].holiday_id) {
        takenCounter++;
      }
    }
    overviewData[`${shifts[x].id}`] = await {
      shiftTime: `${shifts[x].shift_time}`,
      shiftTimeRaw: `${shiftTimeTwelveHourToTwentyFourHour(shifts[x].shift_time)}`,
      totalShifts: shifts[x].number_of_shifts,
      takenShifts: takenCounter,
      availableShifts: shifts[x].number_of_shifts - takenCounter
    };
  }

  async function updateOverviewByOffice(agent, shift) {
    for (let x = 0; x < overviewByOffice[`${agent.Office}`].length; x++) {
      // Limit to the same date between the overview and the stored data
      if (overviewByOffice[`${agent.Office}`][x].shiftDate == shift.holiday_date) {
        // Limit to the same employee level between overview and stored data
        if (overviewByOffice[`${agent.Office}`][x].employeeType == shift.employee_type) {
          if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[1]) &&
              parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
              overviewByOffice[`${agent.Office}`][x].totalAgents += 1;
            }
          } else if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[1]) &&
              parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
              overviewByOffice[`${agent.Office}`][x].totalAgents += 1;
            }
          }
        }
      }
    }
  }

  for (let x = start; x < agentList.length; x++) {
    newStart = parseInt(x)+1;
    let firstPick;
    let secondPick;
    let thirdPick;
    let fourthPick;
    let fifthPick;
    if (requestedShifts.length > 0) {
      for (let y = 0; y < requestedShifts.length; y++) {
        if (agentList[x].EmployeeID == requestedShifts[y].employee_id) {
          if (requestedShifts[y].pick_number == 1 && requestedShifts[y].round_number == roundNumber) {
            firstPick = await requestedShifts[y].holiday_id;
          } else if (requestedShifts[y].pick_number == 2 && requestedShifts[y].round_number == roundNumber) {
            secondPick = await requestedShifts[y].holiday_id;
          } else if (requestedShifts[y].pick_number == 3 && requestedShifts[y].round_number == roundNumber) {
            thirdPick = await requestedShifts[y].holiday_id;
          } else if (requestedShifts[y].pick_number == 4 && requestedShifts[y].round_number == roundNumber) {
            fourthPick = await requestedShifts[y].holiday_id;
          } else if (requestedShifts[y].pick_number == 5 && requestedShifts[y].round_number == roundNumber) {
            fifthPick = await requestedShifts[y].holiday_id;
          }
        }
      }

      // console.log(`Primary: ${firstPick}\nSecondary: ${secondPick}\nTertiary: ${thirdPick}\nQuarternary: ${fourthPick}\nQuinary: ${fifthPick}`);

      if (firstPick || secondPick || thirdPick || fourthPick || fifthPick) {
        if (firstPick && overviewData[`${firstPick}`].availableShifts > 0) {
          updateOverviewByOffice(agentList[x], shifts[firstPick-1]);
          overviewData[firstPick].takenShifts += 1;
          overviewData[firstPick].availableShifts -= 1;
          setShifts[setShifts.length] = [firstPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (secondPick && overviewData[`${secondPick}`].availableShifts > 0) {
          updateOverviewByOffice(agentList[x], shifts[secondPick-1]);
          overviewData[secondPick].takenShifts += 1;
          overviewData[secondPick].availableShifts -= 1;
          setShifts[setShifts.length] = [secondPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (thirdPick && overviewData[`${thirdPick}`].availableShifts > 0) {
          updateOverviewByOffice(agentList[x], shifts[thirdPick-1]);
          overviewData[thirdPick].takenShifts += 1;
          overviewData[thirdPick].availableShifts -= 1;
          setShifts[setShifts.length] = [thirdPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (fourthPick && overviewData[`${fourthPick}`].availableShifts > 0) {
          updateOverviewByOffice(agentList[x], shifts[fourthPick-1]);
          overviewData[fourthPick].takenShifts += 1;
          overviewData[fourthPick].availableShifts -= 1;
          setShifts[setShifts.length] = [fourthPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (fifthPick && overviewData[`${fifthPick}`].availableShifts > 0) {
          updateOverviewByOffice(agentList[x], shifts[fifthPick-1]);
          overviewData[fifthPick].takenShifts += 1;
          overviewData[fifthPick].availableShifts -= 1;
          setShifts[setShifts.length] = [fifthPick, agentList[x].Agent_name, agentList[x].Office];
        } else {
          sendBreakReportEmail({reason: `Agent's selected preferred shifts are no longer available.`, error: 'NoAvailability', agent_name: `${agentList[x].Agent_name}`, start: newStart});
          // build an auto email report with a link for where to restart the automation
          break;
        }
      } else {
          sendBreakReportEmail({reason: 'Agent did not select any preferred shifts.', error: 'NoSelectedShifts', agent_name: `${agentList[x].Agent_name}`, start: newStart});
          // build an auto email report with a link for where to restart the automation
        break;
      }
    }
  }

  return { setShifts: setShifts, overviewByOffice: overviewByOffice };
}

module.exports = { buildSchedule };