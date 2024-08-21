const router = require('express').Router();
const unixEpoch = Math.floor(Date.now() / 1000);
const dotenv = require("dotenv");
const sha256 = require('js-sha256');
const { basementRepairSpecialistsAppointments } = require('../../utils/xmlToJSON');
const { tomorrow, isWeekend } = require('../../utils/dateHandler');
const date = new Date();
const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
let salesPeople = ['Bob Reber', 'Dan Frost'];

dotenv.config();

/* 
  * Time blocks:
  * 8AM-12PM 9AM is available
  * 12PM-4PM 1PM is available
  * 4PM-7PM 5PM is available
*/
function setDayData(date) {
  let dayData = [];
  let times = ['0900', '1300', '1700'];
  let isSorted = false;
  let placeHolder = {};
  for (let i = 0; i < 6; i++) {
    dayData[i] = { date: `${date}`, time: `${times[i % 3]}`, salesPerson: `${salesPeople[i % 2]}`, available: 'TRUE', index: -1};
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

      if(dayData[i].time === dayData[i+1].time && dayData[i].salesPerson > dayData[i+1].salesPerson) {
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
async function checkAvailability(appointmentData) {
  const timeBlocks = [
    {start: '0800', slot: '0900', end: '1200'}, 
    {start: '1200', slot: '1300', end: '1600'}, 
    {start: '1600', slot: '1700', end: '1900'}
  ];
  let count = 0;
  let appointments = {available: new Array(), unAvailable: new Array()};
  let date = tomorrow(today);
  while(isWeekend(date)) {
    date = tomorrow(date);
  }
  let dayObj;
  while(count < 10) {
    dayObj = setDayData(date);
    for(let x = appointmentData.entry.length; x > 0; x--) {
      if(appointmentData.entry[x]) {
        if(parseInt(appointmentData.entry[x].content.properties.appointmentDate.split('-')[0]) <= parseInt(date.split('-')[0])) {
          if(parseInt(appointmentData.entry[x].content.properties.appointmentDate.split('-')[1]) <= parseInt(date.split('-')[1])) {
            if(parseInt(appointmentData.entry[x].content.properties.appointmentDate.split('-')[2]) <= parseInt(date.split('-')[2])) {
              for(let y = 0; y < timeBlocks.length; y++) {
                if(parseInt(appointmentData.entry[x].content.properties.appointmentStartTime.replace(':', '')) >= timeBlocks[y].start && 
                    parseInt(appointmentData.entry[x].content.properties.appointmentStartTime.replace(':', '')) < timeBlocks[y].end) {
                  if(parseInt(appointmentData.entry[x].content.properties.appointmentEndTime.replace(':', '')) > timeBlocks[y].end) {
                    // two time blocks are invalid
                    if(dayObj[y].salesPerson === appointmentData.entry[x].content.properties.salesPerson1) { // If Bob
                      if(dayObj[y]) {
                        dayObj[y].available = 'FALSE';
                        if(dayObj[y+2]) {
                          dayObj[y+2].available = 'FALSE';
                        }
                      }
                    } else { // Else Dan
                      if(dayObj[y+1]) {
                        dayObj[y+1].available = 'FALSE';
                        if(dayObj[y+3]) {
                          dayObj[y+3].available = 'FALSE';
                        }
                      }
                    }
                  } else {
                    // one time block is invalid
                    if(dayObj[y].salesPerson === appointmentData.entry[x].content.properties.salesPerson1) { // If Bob
                      dayObj[y].available = 'FALSE';
                    } else { // Else Dan
                      if(dayObj[y+1]) {
                        dayObj[y+1].available = 'FALSE';
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

    for(let i = 0; i < dayObj.length; i++) {
      if(dayObj[i].available == "FALSE") {
        appointments.unAvailable[appointments.unAvailable.length] = dayObj[i];
      }
      else {
        appointments.available[count] = dayObj[i];
        appointments.available[count].index = count;
        count++;
      }
    }
    date = tomorrow(date);
    while (isWeekend(date)) {
      date = tomorrow(date);
    }
  }

  return appointments;
}

router.get('/', async (req, res) => {
  let returnData;
  const bytes = Buffer.from(`${process.env.COMPANY_ID}${process.env.BASEMENT_REPAIR_SPECIALISTS_API_KEY}${unixEpoch}`, 'ascii');
  const decoded = Buffer.from(`${process.env.BASEMENT_REPAIR_SPECIALISTS_SECRET}`, 'base64');
  const hash = await sha256.hmac(decoded, bytes);
  const encoded = Buffer.from(hash, 'hex').toString('base64');

  try {
    returnData = await fetch(`https://api4.marketsharpm.com/WcfDataService.svc/Appointments?$top=100&$orderby=appointmentDate desc`, { //Appointments
      headers: {
        method: 'GET',
        'Content-Type': 'text/plain; charset=UTF-8',
        'Authorization': `${process.env.COMPANY_ID}:${process.env.BASEMENT_REPAIR_SPECIALISTS_API_KEY}:${unixEpoch}:${encoded}`,
      },
    });

    let parsedReturnData = await returnData.text();

    let appointmentData = await basementRepairSpecialistsAppointments(parsedReturnData, today);

    let availableAppointments = await checkAvailability(appointmentData);

    // console.log(availableAppointments);

    appointmentData = {"Appointment Data": appointmentData, "Availability Data": availableAppointments};

    res.send(appointmentData);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;