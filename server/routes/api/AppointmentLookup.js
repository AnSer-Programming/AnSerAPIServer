const router = require('express').Router();
const config = require('../../config/connectionProductionCustom');
const sql = require('mssql');

const allData = async() => {
  const query = `SELECT * FROM [Accounts].[dbo].[52073Appointments]`;
  let queryResults;
  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });
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
    return "Database Error in File AppointmentLookup.js";
  });

  return await queryResults;
}

const getTimesByDate = async(date, patient) => {
  const query = `SELECT * FROM [Accounts].[dbo].[52073Appointments] WHERE [date] = :date`;
  let queryResults;
  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { replacements: {date: date}, type: seq.QueryTypes.SELECT });
      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  queryResults = await runQuery();

  if(patient == "New Patient") {
    delete queryResults[queryResults.length-1];
  }

  sql.on('error', err => {
    // ... error handler
    console.log("sql on: " + err);
    return "Database Error in File AppointmentLookup.js";
  });

  return await queryResults;
}

router.get('/', async (req, res) => {
  try {
    res.json(await allData());
  } catch (err) {
    res.send(err);
  }
});

router.get('/AppointmentsByDate/:date/:patient', async(req, res) => {
  const date = req.params.date;
  const patient = req.params.patient;
  try {
    res.json(await getTimesByDate(date, patient));
  } catch(err) {
    res.send(err);
  }
});

module.exports = router;