/*
  * H stands for twenty four hour and 1 digit (no leading zero)
  * HH stands for twenty four hour and 2 digits (if typically only displays as single digit then add a leading zero)
  * h stands for twelve hour and 1 digit (no leading zero)
  * hh stands for twelve hour and 2 digits (if typically only displays as single digit then add a leading zero)
  * m stands for minute with 1 digit (no leading zero)
  * mm stands for minute with 2 digits (if typically only displays as single digit then add a leading zero)
  * t stands for single character meridian (a|p)
  * tt stands for two character meridian (am|pm)
*/

/*
  * This function accepts standard twelve hour time formatted as HH:MMtt
  * This function will return a 4 digit twenty four hour time stamp
*/
function twelveHourToTwentyFourHour(data) {
  let time = data.replace(':', '');
  let meridian = data.slice(-2).toLowerCase();
  let number = parseInt(time.slice(0, time.length-2));

  if(meridian == 'pm') {
    if(Math.floor(number/100) != 12) {
      return (number + 1200);
    } else {
      return number;
    }
  } else {
    if(Math.floor(number/100) == '12') {
      return (number - 1200);
    } else {
      return number;
    }
  }
}

function shiftTimeTwelveHourToTwentyFourHour(data) {
  let shiftTimes = new Array();
  let placeHolder;
  shiftTimes = data.split('-');
  for(let i = 0; i < shiftTimes.length; i++) {
    if(shiftTimes[i].includes(12)) {
      if(shiftTimes[i].includes('AM') || shiftTimes[i].includes('am')) {
        shiftTimes[i] = `0000`;
      } else {
        shiftTimes[i] = `1200`;
      }
    } else if(shiftTimes[i].includes('AM') || shiftTimes[i].includes('am')) {
      shiftTimes[i] = shiftTimes[i].slice(0, shiftTimes[i].length-2);
      shiftTimes[i] = `${shiftTimes[i]}00`;
    } else {
      shiftTimes[i] = shiftTimes[i].slice(0, shiftTimes[i].length-2);
      if(shiftTimes[i] == '12') {
        shiftTimes[i] = `0000`;
      } else {
        placeHolder = parseInt(shiftTimes[i]) + 12;
        shiftTimes[i] = `${placeHolder}00`;
      }
    }
  }
  return shiftTimes;
}

module.exports = { twelveHourToTwentyFourHour, shiftTimeTwelveHourToTwentyFourHour };