export const staticScheduleValidator = (data:any) => {
  let startTimes:any[] = new Array();
  let endTimes:any[] = new Array();
  if(data) {
    startTimes = data.start;
    endTimes = data.end;
  }

  for(let i = 0; i < startTimes.length; i++) {
    if(startTimes[i] < endTimes[i-1] || startTimes[i] > endTimes[i+1]) {
      return i;
    }
  }

  return -1;
}