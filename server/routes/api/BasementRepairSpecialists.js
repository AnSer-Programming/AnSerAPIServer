const router = require('express').Router();
const dotenv = require("dotenv");
const sha256 = require('js-sha256');
const { basementRepairSpecialistsAppointments } = require('../../utils/xmlToJSON');
const { tomorrow, isWeekend } = require('../../utils/dateHandler');
const { isHoliday } = require('../../utils/holidayCheck');
const { dataBaseData } = require('./BasementRepairSpecialistsDatabaseData');
const { mainDataHandler } = require('./BasementRepairSpecialistsDataHandler');
const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let salesPeople = ['Bob Reber', 'Dan Frost'];

dotenv.config();

/* 
  * Time blocks:
  * 8AM-12PM 9AM is available
  * 12PM-4PM 1PM is available
  * 4PM-7PM 5PM is available | Changed to be 4PM-8PM so that it works better with my algorythm
*/
function setDayData(date) {
  let dayData = [];
  let times = ['0900', '1300', '1700'];
  let isSorted = false;
  let placeHolder = {};
  for (let i = 0; i < 6; i++) {
    dayData[i] = { date: `${date}`, time: `${times[i % 3]}`, formattedTime: '', salesPerson: `${salesPeople[i % 2]}`, available: 'TRUE', index: -1, value: '' };
  }

  let check = new Array();

  while (!isSorted) {
    for (let i = 0; i < dayData.length - 1; i++) {
      if (parseInt(dayData[i].time) <= parseInt(dayData[i + 1].time)) {
        check[i] = true;
      } else {
        placeHolder = dayData[i];
        dayData[i] = dayData[i + 1];
        dayData[i + 1] = placeHolder;
        check[i] = false;
      }

      if (dayData[i].time === dayData[i + 1].time && dayData[i].salesPerson > dayData[i + 1].salesPerson) {
        placeHolder = dayData[i];
        dayData[i] = dayData[i + 1];
        dayData[i + 1] = placeHolder;
        check[i] = false;
      }
    }

    for (let i = 0; i < check.length; i++) {
      if (!check[i]) {
        isSorted = false;
        break;
      } else if (i === check.length - 1 && check[i]) {
        isSorted = true;
      }
    }
  }

  return dayData;
}

/*
  * Rules:
  * Each Time slots has 2 points of availability.
  * Check if a salesperson is available in one or the other.
  * If neither the time slot is unavailable.
  * If only one person then the time slot is available for the one sales person.
  * If both are open then the time slot is available for both sales people and the agent will get to pick which sales person gets the appointment.
  * Add 2hours:29minutes to the end of scheduled event.
  * If the time slot bleeds into the next time slot then both time slots are unavailable.
  * Example if appointment is at 8AM then the 8AM-12PM slot is unavailable.
  * Example if appointment is at 10AM then the 8AM-12PM and 12PM-4PM slots are unavailable
*/
async function checkAvailability(appointmentData, today) {
  const scheduledAppointments = await dataBaseData();
  const timeBlocks = [
    { start: '0800', slot: '0900', end: '1200' },
    { start: '1200', slot: '1300', end: '1600' },
    { start: '1600', slot: '1700', end: '2000' }
  ];
  let count = 0;
  let appointments = { available: new Array() };
  let date = tomorrow(today);
  let dayObj;
  let time;
  let formattedDate;
  let formattedDay;
  while ((isWeekend(date) || await isHoliday(1028, date)) || (isWeekend(date) && await isHoliday(1028, date))) { //Check if it is the weekend and/or is a holiday
    date = tomorrow(date);
  }

  while (count < 15) { //Get 15 rows of data
    dayObj = setDayData(await date); //set time slots and saleperson for the entire day
    for (let x = appointmentData.entry.length; x > 0; x--) { //Begin check to see if an appointment slot has already been filled
      if (appointmentData.entry[x]) { //Check that appointmentData.entry[x] exists
        if (parseInt(appointmentData.entry[x].content.properties.appointmentDate.split('-')[0]) == parseInt(date.split('-')[0])) { //Year check
          if (parseInt(appointmentData.entry[x].content.properties.appointmentDate.split('-')[1]) == parseInt(date.split('-')[1])) { //Month check
            if (parseInt(appointmentData.entry[x].content.properties.appointmentDate.split('-')[2]) == parseInt(date.split('-')[2])) { //Day check
              for (let y = 0; y < timeBlocks.length; y++) { //Begin loop for the time block validation
                if (parseInt(appointmentData.entry[x].content.properties.appointmentStartTime.replace(':', '')) >= timeBlocks[y].start &&
                  parseInt(appointmentData.entry[x].content.properties.appointmentStartTime.replace(':', '')) < timeBlocks[y].end) { //Check for chich index of the time block that an appointment is in
                  if (parseInt(appointmentData.entry[x].content.properties.appointmentEndTime.replace(':', '')) > timeBlocks[y].end) { //Check if the appointment extends past the original time block
                    // two time blocks are invalid
                    for (let z = 0; z < dayObj.length; z++) { //Begin loop for the dayObj data
                      if (timeBlocks[y].slot === dayObj[z].time) { //Check if the taken time block matches the row in the dayObj
                        if (dayObj[z].salesPerson === appointmentData.entry[x].content.properties.salesPerson1) { //Check if the assigned salesPerson matches the salesPerson in the dayObj
                          dayObj[z].available = 'FALSE'; //Set available to false | Unavailable
                        }
                      } else if (timeBlocks[y + 1].slot === dayObj[z].time) { //Check the next time block (double block)
                        if (dayObj[z].salesPerson === appointmentData.entry[x].content.properties.salesPerson1) { //Check if the assigned salesPerson matches the salesPerson in the dayObj
                          dayObj[z].available = 'FALSE'; //Set available to false | Unavailable
                        }
                      }
                    }
                  } else { //The appointment does not extend into another time block
                    // one time block is invalid
                    for (let z = 0; z < dayObj.length; z++) { //Begin loop for the dayObj data
                      if (timeBlocks[y].slot === dayObj[z].time) { //Check if the taken time block matches the row in the dayObj
                        if (dayObj[z].salesPerson === appointmentData.entry[x].content.properties.salesPerson1) { //Check if the assigned salesPerson matches the salesPerson in the dayObj
                          dayObj[z].available = 'FALSE'; //Set available to false | Unavailable
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    for (let x = 0; x < scheduledAppointments.length; x++) { //Begin check to see if an appointment slot has already been filled by AnSer
      if (scheduledAppointments[x]) { //Check to make sure scheduledAppointment[x] does exist
        if (parseInt(scheduledAppointments[x].Date.split('-')[0]) == parseInt(date.split('-')[0])) { //Check Year
          if (parseInt(scheduledAppointments[x].Date.split('-')[1]) == parseInt(date.split('-')[1])) { //Check Month
            if (parseInt(scheduledAppointments[x].Date.split('-')[2]) == parseInt(date.split('-')[2])) { //Check Day
              for (let y = 0; y < timeBlocks.length; y++) { //Begin loop for the time block validation
                if (parseInt(scheduledAppointments[x].rawtime) == timeBlocks[y].slot) {
                  for (let z = 0; z < dayObj.length; z++) { //Begin loop for the dayObj data
                    if (timeBlocks[y].slot === dayObj[z].time) { //Check if the taken time block matches the row in the dayObj
                      if (dayObj[z].salesPerson === scheduledAppointments[x].Salesperson) { //Check if the assigned salesPerson matches the salesPerson in the dayObj
                        if (scheduledAppointments[x].Cancelled) {
                          dayObj[z].available = 'TRUE'; //Set available to true | The appointment was cancelled on our end
                        } else {
                          dayObj[z].available = 'FALSE'; //Set available to false | Unavailable
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    for (let i = 0; i < dayObj.length; i++) {
      if (dayObj[i].available == "TRUE") {
        appointments.available[count] = dayObj[i];
        appointments.available[count].index = count;
        if (dayObj[i].time === "0900") {
          time = '9AM';
        } else if (dayObj[i].time === "1300") {
          time = '1PM';
        } else if (dayObj[i].time === "1700") {
          time = '5PM';
        }

        formattedDay = parseInt(dayObj[i].date.split('-')[2]);
        if (formattedDay % 10 === 1) {
          formattedDay = `${formattedDay}th`;
        } else {
          if (dayObj[i].date.split('-')[2] % 10 === 1) {
            formattedDay = `${formattedDay}st`;
          } else if (dayObj[i].date.split('-')[2] % 10 === 2) {
            formattedDay = `${formattedDay}nd`;
          } else if (dayObj[i].date.split('-')[2] % 10 === 3) {
            formattedDay = `${formattedDay}rd`;
          } else {
            formattedDay = `${formattedDay}th`;
          }
        }

        formattedDate = `${days[new Date(dayObj[i].date).getDay() + 1]} ${months[parseInt(dayObj[i].date.split('-')[1]) - 1]} ${formattedDay}`;

        appointments.available[count].formattedTime = time;
        appointments.available[count].value = `${formattedDate} at ${time} with ${appointments.available[count].salesPerson}`;
        count++;
      }
    }
    date = tomorrow(date);
    while ((isWeekend(date) || await isHoliday(1028, date)) || (isWeekend(date) && await isHoliday(1028, date))) {//Check if it is the weekend and/or is a holiday
      date = tomorrow(date);
    }
  }

  return appointments;
}

router.get('/', async (req, res) => {
  const date = new Date();
  const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const unixEpoch = Math.floor(Date.now() / 1000);
  let returnData;

  // DO NOT TOUCH THESE LINES!
  const bytes = Buffer.from(`${process.env.COMPANY_ID}${process.env.BASEMENT_REPAIR_SPECIALISTS_API_KEY}${unixEpoch}`, 'ascii');
  const decoded = Buffer.from(`${process.env.BASEMENT_REPAIR_SPECIALISTS_SECRET}`, 'base64');
  const hash = await sha256.hmac(decoded, bytes);
  const encoded = Buffer.from(hash, 'hex').toString('base64');
  // DO NOT TOUCH THESE LINES!

  try {
    returnData = await fetch(`https://api4.marketsharpm.com/WcfDataService.svc/Appointments?$top=100&$orderby=appointmentDate desc`, { //Appointments
      headers: {
        method: 'GET',
        'Content-Type': 'text/plain; charset=UTF-8',
        'Authorization': `${process.env.COMPANY_ID}:${process.env.BASEMENT_REPAIR_SPECIALISTS_API_KEY}:${unixEpoch}:${encoded}`,
      },
    });

    let parsedReturnData = await returnData.text();
    console.log(parsedReturnData);

    let appointmentData = await basementRepairSpecialistsAppointments(parsedReturnData, today);

    let availableAppointments = await checkAvailability(appointmentData, today);

    appointmentData = { AppointmentData: appointmentData, AvailabilityData: availableAppointments };

    res.json(appointmentData);
  } catch (err) {
    res.send(err);
  }
});

router.post('/SendLeadData', async (req, res) => {
  let values = req.body;
  let sendData;

  for (key in values) {
    if (sendData) {
      sendData += '&|&';
    }
    if (!sendData) {
      sendData = `${key}=${encodeURIComponent(values[key])}`;
    } else {
      sendData += `${key}=${encodeURIComponent(values[key])}`;
    }
  }

  try {
    returnData = await fetch(`https://haaws.marketsharpm.com/LeadCapture/MarketSharp/LeadCapture.ashx?callback=?`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        "info": sendData,
        "version": 2
      }
    });
  } catch (err) {
    res.send(`Errors: ${err}`);
  }

  console.log(returnData);

  res.send(returnData);
})

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const sendData = mainDataHandler(req.body);

    console.log(req.body);
    console.log(sendData);
    res.json(sendData);
  } catch (err) {
    console.err(err);
  }
});

module.exports = router;