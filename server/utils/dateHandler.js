/*
  * If the year is divisible by 4, it's a leap year, except for end-of-century years, which must also be divisible by 400
  * To do the calculation in order to figure out if it is a century then it is year MOD 100 = 0
  * If it is a century then year MOD 400 = 0 is a Leap Year
  * Otherwise year MOD 4 = 0 is a leap year
*/
function leapYearCheck(year) {
  if (year % 100 === 0) {
    if (year % 400 === 0) {
      return true;
    } else {
      return false;
    }
  } else {
    if (year % 4 === 0) {
      return true;
    } else {
      return false;
    }
  }
}

/*
  * Expected Format:
  * yyyy-m-d
  * Returned Format:
  * yyyy-mm-dd
*/
const tomorrow = (data) => {
  let year = data.split('-')[0];
  let month = data.split('-')[1];
  let day = data.split('-')[2];
  const isLeapYear = leapYearCheck(year);

  function monthCheck() {
    switch (parseInt(month)) {
      case 1:
        if (day === '31') {
          return `${year}-02-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 2:
        if (isLeapYear) {
          if (day === '29') {
            return `${year}-03-01`;
          } else {
            if(`${parseInt(day) + 1}`.length < 2) {
              return `${year}-${month}-0${parseInt(day) + 1}`;
            }
            return `${year}-${month}-${parseInt(day) + 1}`;
          }
        } else {
          if (day === '28') {
            return `${year}-03-01`;
          } else {
            if(`${parseInt(day) + 1}`.length < 2) {
              return `${year}-${month}-0${parseInt(day) + 1}`;
            }
            return `${year}-${month}-${parseInt(day) + 1}`;
          }
        }
      case 3:
        if (day === '31') {
          return `${year}-04-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 4:
        if (day === '30') {
          return `${year}-05-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 5:
        if (day === '31') {
          return `${year}-06-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 6:
        if (day === '30') {
          return `${year}-07-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 7:
        if (day === '31') {
          return `${year}-08-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 8:
        if (day === '31') {
          return `${year}-09-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 9:
        if (day === '30') {
          return `${year}-10-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 10:
        if (day === '31') {
          return `${year}-11-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 11:
        if (day === '30') {
          return `${year}-12-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      case 12:
        if (day === '31') {
          return `${year}-01-01`;
        } else {
          if(`${parseInt(day) + 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) + 1}`;
          }
          return `${year}-${month}-${parseInt(day) + 1}`;
        }
      default:
        console.log("ERROR!");
        return (-1);
    }
  }

  return monthCheck();
}

const yesterday = (data) => {
  let year = data.split('-')[0];
  let month = data.split('-')[1];
  let day = data.split('-')[2];
  const isLeapYear = leapYearCheck(year);

  function monthCheck() {
    switch (parseInt(month)) {
      case 1:
        if (day === '1') {
          return `${year}-12-31`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 2:
        if (day === '1') {
          return `${year}-01-31`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 3:
        if (isLeapYear) {
          if (day === '1') {
            return `${year}-02-29`;
          } else {
            if(`${parseInt(day) - 1}`.length < 2) {
              return `${year}-${month}-0${parseInt(day) - 1}`;
            }
            return `${year}-${month}-${parseInt(day) - 1}`;
          }
        } else {
          if (day === '1') {
            return `${year}-02-28`;
          } else {
            if(`${parseInt(day) - 1}`.length < 2) {
              return `${year}-${month}-0${parseInt(day) - 1}`;
            }
            return `${year}-${month}-${parseInt(day) - 1}`;
          }
        }
      case 4:
        if (day === '1') {
          return `${year}-03-31`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 5:
        if (day === '1') {
          return `${year}-04-30`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 6:
        if (day === '1') {
          return `${year}-05-31`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 7:
        if (day === '1') {
          return `${year}-06-30`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 8:
        if (day === '1') {
          return `${year}-07-31`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 9:
        if (day === '1') {
          return `${year}-8-31`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 10:
        if (day === '1') {
          return `${year}-9-30`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 11:
        if (day === '1') {
          return `${year}-10-31`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      case 12:
        if (day === '1') {
          return `${year}-11-30`;
        } else {
          if(`${parseInt(day) - 1}`.length < 2) {
            return `${year}-${month}-0${parseInt(day) - 1}`;
          }
          return `${year}-${month}-${parseInt(day) - 1}`;
        }
      default:
        console.log("ERROR!");
        return (-1);
    }
  }

  return monthCheck();
}

const isSaturday = (date) => {
  if (new Date(date).getDay() === 6) {
    return true;
  } else {
    return false;
  }
}

const isSunday = (date) => {
  if (new Date(date).getDay() === 0) {
    return true;
  } else {
    return false;
  }
}

const isWeekend = (date) => {
  if (isSunday(date)) {
    return true;
  } else if (isSaturday(date)) {
    return true;
  } else {
    return false;
  }
}

const isWeekday = (date) => {
  if (isSunday(date)) {
    return false;
  } else if (isSaturday(date)) {
    return false;
  } else {
    return true;
  }
}

module.exports = { tomorrow, yesterday, isSaturday, isSunday, isWeekend, isWeekday };