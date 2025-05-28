export const shiftAssigner = async (holidayData: any) => {
  async function objectBuilder() {
    let objectData: any = new Array();
    let counter: number = 0;
    for (let x = 0; x < holidayData[0].length; x++) {
      for (let y = 0; y < holidayData[0][x].number_of_shifts; y++) {
        objectData[counter] = await holidayData[0][x];
        objectData[counter]['agentName'] = "Available";
        counter++;
      }
    }

    return await objectData;
  }

  async function assignAgentToShift(data: any) {
    let combinedData: any = data;
    let found: boolean = false;
    for (let x = 0; x < holidayData[1].length; x++) {
      found = false;
      for (let y = 0; y < combinedData.length; y++) {
        if (!found) {
          if (holidayData[1][x].holiday_id == combinedData[y].id && combinedData[y].agentName == "Available") {
            combinedData[y].agentName = await holidayData[1][x].agent_name;
            found = true;
          }
        }
      }
    }

    return await data;
  }

  async function main() {
    let rawShiftData: any = new Array();
    let shiftData: any = new Array();
    rawShiftData = await objectBuilder();
    // shiftData = await assignAgentToShift(rawShiftData);
    return shiftData;
  }

  return await main();
}