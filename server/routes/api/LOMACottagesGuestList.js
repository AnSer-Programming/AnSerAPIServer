const router = require('express').Router();
const config = require('../../config/connectionProductionCustom');
const sql = require('mssql');

const getCurrentDate = async() => {
  const date = new Date();
  let year = date.getFullYear();
  let month;
  let day;
  const modifier = 0;
  if(`${date.getMonth() + 1}`.length < 2) { //Check if month is 2-digits. If 1-digit month number then append a 0 at the beginning of the string
    month = `0${date.getMonth() + 1}`;
  } else {
    month = `${date.getMonth() + 1}`;
  }
  if(`${date.getDate() + modifier}`.length < 2) { //Check if day is 2-digits. If 1-digit day number then append a 0 at the beginning of the string
    day = `0${date.getDate() + modifier}`;
  } else {
    day = `${date.getDate() + modifier}`;
  }
  const today = `${year}-${month}-${day}`;
  console.log(today);
  console.log(today.split('-'));
  return today;
}

const dataBaseData = async() => {
  const query = `SELECT * FROM [Accounts].[dbo].[13020_lomaGuestList]`;
  let queryResults;
  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });
      console.log(result);
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  queryResults = await runQuery();

  sql.on('error', err => {
    // ... error handler
    console.log("sql on: " + err);
    return "Database Error in File LOMACottagesGuestList.js";
  });

  return await queryResults;
}

router.get('/', async (req, res) => {
  try {
    res.json(await dataBaseData());
  } catch (err) {
    res.send(err);
  }
});

router.get('/:cottage', async (req, res) => {
  try {
    console.log(req.params.cottage);
    const data = await dataBaseData();
    const today = await getCurrentDate();
    let returnData = new Array();
    let count = 0;
    for(let i = 0; i < data.length; i++) {
      if(data[i].cottage == req.params.cottage) { //index 1 will be month, index 2 will be day, index 0 is year
        if(parseInt(data[i].check_in_date.split('-')[1]) == parseInt(today.split('-')[1]) && parseInt(data[i].check_out_date.split('-')[1]) == parseInt(today.split('-')[1])) {
          if(parseInt(data[i].check_in_date.split('-')[2]) <= parseInt(today.split('-')[2]) && parseInt(data[i].check_out_date.split('-')[2]) > parseInt(today.split('-')[2])) {
            returnData[count] = data[i];
            count++;
          }//day check
        } else if(parseInt(data[i].check_in_date.split('-')[1]) == parseInt(today.split('-')[1]) && parseInt(data[i].check_out_date.split('-')[1]) == parseInt(today.split('-')[1])+1) {
          if(parseInt(data[i].check_in_date.split('-')[2]) <= parseInt(today.split('-')[2]) && parseInt(data[i].check_out_date.split('-')[1]) > parseInt(today.split('-')[1])) {
            returnData[count] = data[i];
            count++;
          }//day check
        } else if(parseInt(data[i].check_in_date.split('-')[1]) == parseInt(today.split('-')[1])-1 && parseInt(data[i].check_out_date.split('-')[1]) == parseInt(today.split('-')[1])) {
          if(parseInt(data[i].check_out_date.split('-')[2]) > parseInt(today.split('-')[2])) { 
            returnData[count] = data[i];
            count++;
          }//day check
        }//month check
      }
    }
    if(!returnData[0]) {
      returnData[0] = {Empty: "No Occupancy"};
    }
    res.json(returnData);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;