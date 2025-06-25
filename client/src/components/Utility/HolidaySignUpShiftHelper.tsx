export const shiftAssigner = async (holidayData: any) => {
  async function objectBuilder() {
    let objectData: any = new Array();
    let counter: number = 0;
    for (let x = 0; x < holidayData[0].length; x++) {
      for (let y = 0; y < holidayData[0][x].number_of_shifts; y++) {
        objectData.push({holidayID: holidayData[0][x].id});
        objectData[counter]['holiday'] = await holidayData[0][x].holiday;
        objectData[counter]['employeeType'] = await holidayData[0][x].employee_type;
        objectData[counter]['holidayDate'] = await holidayData[0][x].holiday_date;
        objectData[counter]['shiftTime'] = await holidayData[0][x].shift_time;
        objectData[counter]['shiftID'] = -1;
        objectData[counter]['agentName'] = "Available";
        counter++;
      }
    }

    return await objectData;
  }

  async function assignAgentToShift(data: any) {
    let combinedData: any = data;
    let found: boolean = false;
    let comparisonData = holidayData[1].sort((a:any, b:any) => a.holiday_id - b.holiday_id);
    for (let x = 0; x < comparisonData.length; x++) {
      found = false;
      for (let y = 0; y < combinedData.length; y++) {
        if (!found) {
          if (comparisonData[x].holiday_id == combinedData[y].holidayID && combinedData[y].agentName == "Available") {
            combinedData[y].agentName = await comparisonData[x].agent_name;
            combinedData[y].shiftID = await comparisonData[x].id;
            found = true;
          }
        }
      }
    }

    return await combinedData;
  }

  async function main() {
    let rawShiftData: any = new Array();
    let shiftData: any = new Array();
    rawShiftData = await objectBuilder();
    shiftData = await assignAgentToShift(rawShiftData);
    return shiftData;
  }

  return await main();
}

export const shiftOverview = (data:any) => {
  const shifts = data[0];
  const takenShifts = data[1];
  let availableCounter:number = 0;
  let takenCounter:number = 0;
  let overviewData:any = new Array();

  for(let x = 0; x < shifts.length; x++) {
    takenCounter = 0;
    availableCounter = 0;
    overviewData.push({shiftID: shifts[x].id});
    for(let y = 0; y < takenShifts.length; y++) {
      if(overviewData[x].shiftID == takenShifts[y].holiday_id) {
        takenCounter++;
      }
    }
    availableCounter = shifts[x].number_of_shifts - takenCounter;
    overviewData[x]["totalShifts"] = shifts[x].number_of_shifts;
    overviewData[x]["numberOfAvailable"] = availableCounter;
    overviewData[x]["numberOfUnavailable"] = takenCounter;
    overviewData[x]["employeeType"] = shifts[x].employee_type;
    overviewData[x]["shiftTime"] = shifts[x].shift_time;
  }

  return overviewData;
}