const configAPI = require('../../config/connection');
const sql = require('mssql');
const seq = require('sequelize');
const { day_month_year } = require('../../utils/dateHandler');

async function runPostQuery(data) {
  let query;
  let result;
  try {
    for (let i = 0; i < data.POST.length; i++) { //Iterate through each provider
      query = `INSERT INTO [isapi].[dbo].[qgendaProviders] (first_name, last_name, staff_key, active, start_date, date_inactive, date_adjusted) 
        VALUES (
          '${data.POST[i].first_name}', 
          '${data.POST[i].last_name}', 
          '${data.POST[i].staff_key}', 
          '${data.POST[i].active}', 
          '${data.POST[i].start_date}', 
          ${data.POST[i].date_inactive == null ? null : `'${data.POST[i].date_inactive}'`}, 
          '${data.POST[i].date_adjusted}'
        )`;
      result = await configAPI.query(query, { type: seq.QueryTypes.SELECT });
    }
    return result;
  } catch (err) {
    // ... error checks
    console.log("catch block: " + err);
  }
}

async function runUpdateQuery(data) {
  let query;
  let result;
  try {
    for (let i = 0; i < data.UPDATE.length; i++) { //Iterate through each provider
      query = `UPDATE [isapi].[dbo].[qgendaProviders] 
        SET 
          active = '${data.UPDATE[i].active}', 
          date_inactive = '${data.UPDATE[i].date_inactive}', 
          date_adjusted = '${data.UPDATE[i].date_adjusted}'
        WHERE staff_key='${data.UPDATE[i].staff_key}'`;
      result = await configAPI.query(query, { type: seq.QueryTypes.SELECT });
    }
    return result;
  } catch (err) {
    // ... error checks
    console.log("catch block: " + err);
  }
}

async function main(data) {
  if(data.POST) {
    runPostQuery(data);
  } 
  if(data.UPDATE) {
    runUpdateQuery(data);
  }
}

module.exports = main;