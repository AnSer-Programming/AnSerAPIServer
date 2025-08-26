const { shiftTimeTwelveHourToTwentyFourHour } = require('../../utils/timeHandler');

async function buildSchedule(agents, requestedShifts, shifts, savedShifts, roundNumber) {
  let takenShifts = savedShifts;
  let takenCounter;
  let overviewData = {};
  let setShifts = new Array();
  let agentList = agents[0];
  let overviewByOffice = agents[1];

  for (let x = 0; x < shifts.length; x++) {
    takenCounter = 0;
    for (let y = 0; y < takenShifts.length; y++) {
      if (shifts[x].id == takenShifts[y].holiday_id) {
        takenCounter++
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

  // for(let x = 0; x < overviewData.length; x++) {

  // }

  for (let x = 0; x < agentList.length; x++) {
    let firstPick;
    let secondPick;
    if (requestedShifts.length > 0) {
      for (let y = 0; y < requestedShifts.length; y++) {
        if (agentList[x].EmployeeID == requestedShifts[y].employee_id) {
          if (requestedShifts[y].pick_number == 1 && requestedShifts[y].round_number == roundNumber) {
            firstPick = await requestedShifts[y].holiday_id;
          } else if (requestedShifts[y].pick_number == 2 && requestedShifts[y].round_number == roundNumber) {
            secondPick = await requestedShifts[y].holiday_id;
          }
        }
      }
      if (firstPick || secondPick) {
        if (firstPick && overviewData[`${firstPick}`].availableShifts > 0) {
          overviewData[firstPick].takenShifts += 1;
          overviewData[firstPick].availableShifts -= 1;
          setShifts[setShifts.length] = [firstPick, agentList[x].Agent_name];
        } else if (secondPick && overviewData[`${secondPick}`].availableShifts > 0) {
          overviewData[secondPick].takenShifts += 1;
          overviewData[secondPick].availableShifts -= 1;
          setShifts[setShifts.length] = [secondPick, agentList[x].Agent_name];
        }
      }
    }
  }

  return setShifts;
}

module.exports = { buildSchedule };