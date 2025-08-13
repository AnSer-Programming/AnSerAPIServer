async function findShifts(shifts, savedShifts, primaryShift) {
  let takenShifts = savedShifts;
  let takenCounter;
  let overviewData = new Array();
  let setShifts = new Array();

  for (let x = 0; x < shifts.length; x++) {
    takenCounter = 0;
    for (let y = 0; y < takenShifts.length; y++) {
      if (shifts[x].id == takenShifts[y].holiday_id) {
        takenCounter++
      }
    }
    overviewData[`${x}`] = await {
      id: shifts[x].id,
      shiftTime: `${shifts[x].shift_time}`,
      shiftDate: `${shifts[x].holiday_date}`,
      shiftHoliday: `${shifts[x].holiday}`,
      totalShifts: shifts[x].number_of_shifts,
      takenShifts: takenCounter,
      availableShifts: shifts[x].number_of_shifts - takenCounter
    };
  }

  for(let x = 0; x < overviewData.length; x++) {
    if(overviewData[x].availableShifts != 0 && overviewData[x].id != primaryShift) {
      setShifts[setShifts.length] = {
        id: overviewData[x].id,
        shiftTime: overviewData[x].shiftTime,
        shiftDate: overviewData[x].shiftDate,
        shiftHoliday: overviewData[x].shiftHoliday,
      };
    }
  }

  return setShifts;
}

module.exports = { findShifts };