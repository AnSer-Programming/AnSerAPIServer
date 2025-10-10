const { shiftTimeTwelveHourToTwentyFourHour } = require('../timeHandler');
const sendBreakReportEmail = require('../../node-mailer/AgentSuccess/automationBreakReport');
const sendSuccessReportEmail = require('../../node-mailer/AgentSuccess/automationSuccessReport');

async function buildSchedule(agents, requestedShifts, shifts, savedShifts, roundNumber, start) {
  let newStart;
  let takenShifts = savedShifts;
  let takenCounter;
  let overviewData = {};
  let setShifts = new Array();
  let agentList = agents[0];
  let overviewByOffice = {};
  let offices = agents[1];
  let isBuilt = false;

  for (let x = 0; x < offices.length; x++) {
    overviewByOffice[`${offices[x].office_location}`] = new Array();
    for (let y = 0; y < shifts.length; y++) {
      overviewByOffice[`${offices[x].office_location}`][y] = await {
        shiftID: shifts[y].id,
        shiftDate: shifts[y].holiday_date,
        shiftTime: shifts[y].shift_time,
        employeeType: shifts[y].employee_type,
        shiftTimeRaw: shiftTimeTwelveHourToTwentyFourHour(shifts[y].shift_time),
        totalShifts: shifts[y].number_of_shifts,
        totalAgents: 0,
        availableSeats: offices[x].number_of_agent_stations
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
              overviewByOffice[`${takenShifts[x].agent_office}`][y].totalAgents = 1 + parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].totalAgents);
            }
          } else if (parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[0]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[0])) {
            if (parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[0]) < await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[1]) &&
              parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(takenShifts[x].shift_time)[0])) {
              overviewByOffice[`${takenShifts[x].agent_office}`][y].totalAgents = 1 + parseInt(overviewByOffice[`${takenShifts[x].agent_office}`][y].totalAgents);
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

  async function getShiftData(shiftID) { // This is used to help organize data since shifts may need to be removed from the database causing a skip in the id
    for(let i = 0; i < shifts.length; i++) {
      if(parseInt(shiftID) == parseInt(shifts[i].id)) {
        return shifts[i];
      }
    }
  }

  async function updateOverviewByOffice(agent, shift) {
    for (let x = 0; x < overviewByOffice[`${agent.Office}`].length; x++) {
      // Limit to the same date between the overview and the stored data
      if (overviewByOffice[`${agent.Office}`][x].shiftDate == shift.holiday_date) {
        // Limit to the same employee level between overview and stored data
        if (agent.Agent_name == "Nora Manzanares") {
          console.log(shift, " ", shift.shift_time, " ", shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0]);
        }
        if (overviewByOffice[`${agent.Office}`][x].employeeType == shift.employee_type) {
          if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) == await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            overviewByOffice[`${agent.Office}`][x].totalAgents = 1 + parseInt(overviewByOffice[`${agent.Office}`][x].totalAgents);
          } else if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[1]) &&
              parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
              overviewByOffice[`${agent.Office}`][x].totalAgents = 1 + parseInt(overviewByOffice[`${agent.Office}`][x].totalAgents);
            }
          } else if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[1]) &&
              parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
              overviewByOffice[`${agent.Office}`][x].totalAgents = 1 + parseInt(overviewByOffice[`${agent.Office}`][x].totalAgents);
            }
          }
        }
      }
    }
  }

  async function officeAvailable(agent, shift) {
    let isAvailable = true;
    for (let x = 0; x < overviewByOffice[`${agent.Office}`].length; x++) {
      if (overviewByOffice[`${agent.Office}`][x].shiftDate == shift.holiday_date) {
        if (overviewByOffice[`${agent.Office}`][x].employeeType == shift.employee_type) {
          if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) == await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            if (overviewByOffice[`${agent.Office}`][x].availableSeats == overviewByOffice[`${agent.Office}`][x].totalAgents) {
              isAvailable = false;
              break;
            }
          } else if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[1]) &&
              parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
              if (overviewByOffice[`${agent.Office}`][x].availableSeats == overviewByOffice[`${agent.Office}`][x].totalAgents) {
                isAvailable = false;
                break;
              }
            }
          } else if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
            if (parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[0]) <= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[1]) &&
              parseInt(overviewByOffice[`${agent.Office}`][x].shiftTimeRaw[1]) >= await parseInt(shiftTimeTwelveHourToTwentyFourHour(shift.shift_time)[0])) {
              if (overviewByOffice[`${agent.Office}`][x].availableSeats == overviewByOffice[`${agent.Office}`][x].totalAgents) {
                isAvailable = false;
                break;
              }
            }
          }
        }
      }
    }

    return isAvailable;
  }

  for (let x = start; x < agentList.length; x++) {
    newStart = parseInt(x) + 1;
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

      if (firstPick || secondPick || thirdPick || fourthPick || fifthPick) {
        isBuilt = true;
        if (firstPick && overviewData[`${firstPick}`].availableShifts > 0 && await officeAvailable(agentList[x], shifts[firstPick - 1])) {
          await updateOverviewByOffice(agentList[x], await getShiftData(firstPick));
          overviewData[`${firstPick}`].takenShifts += 1;
          overviewData[`${firstPick}`].availableShifts -= 1;
          setShifts[setShifts.length] = [firstPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (secondPick && overviewData[`${secondPick}`].availableShifts > 0 && await officeAvailable(agentList[x], shifts[firstPick - 1])) {
          await updateOverviewByOffice(agentList[x], await getShiftData(secondPick));
          overviewData[`${secondPick}`].takenShifts += 1;
          overviewData[`${secondPick}`].availableShifts -= 1;
          setShifts[setShifts.length] = [secondPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (thirdPick && overviewData[`${thirdPick}`].availableShifts > 0 && await officeAvailable(agentList[x], shifts[firstPick - 1])) {
          await updateOverviewByOffice(agentList[x], await getShiftData(thirdPick));
          overviewData[`${thirdPick}`].takenShifts += 1;
          overviewData[`${thirdPick}`].availableShifts -= 1;
          setShifts[setShifts.length] = [thirdPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (fourthPick && overviewData[`${fourthPick}`].availableShifts > 0 && await officeAvailable(agentList[x], shifts[firstPick - 1])) {
          await updateOverviewByOffice(agentList[x], await getShiftData(fourthPick));
          overviewData[`${fourthPick}`].takenShifts += 1;
          overviewData[`${fourthPick}`].availableShifts -= 1;
          setShifts[setShifts.length] = [fourthPick, agentList[x].Agent_name, agentList[x].Office];
        } else if (fifthPick && overviewData[`${fifthPick}`].availableShifts > 0 && await officeAvailable(agentList[x], shifts[firstPick - 1])) {
          await updateOverviewByOffice(agentList[x], await getShiftData(fifthPick));
          overviewData[`${fifthPick}`].takenShifts += 1;
          overviewData[`${fifthPick}`].availableShifts -= 1;
          setShifts[setShifts.length] = [fifthPick, agentList[x].Agent_name, agentList[x].Office];
        } else {
          isBuilt = false;
          sendBreakReportEmail({ reason: `Agent's selected preferred shifts are no longer available.`, error: 'NoAvailability', agent_name: `${agentList[x].Agent_name}`, start: newStart });
          break;
        }
      } else {
        isBuilt = false;
        sendBreakReportEmail({ reason: 'Agent did not select any preferred shifts.', error: 'NoSelectedShifts', agent_name: `${agentList[x].Agent_name}`, start: newStart });
        break;
      }
    }
  }

  // sendSuccessReportEmail(setShifts);

  return { scheduleBuild: isBuilt, setShifts: setShifts, overviewByOffice: overviewByOffice, overviewData: overviewData };
}

module.exports = { buildSchedule };