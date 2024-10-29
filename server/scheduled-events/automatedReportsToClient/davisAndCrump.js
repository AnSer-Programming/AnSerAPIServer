const config = require('../../config/connectionProductionCustom');
const sql = require('mssql');
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const { yesterday } = require('../../utils/dateHandler');
const { twelveHourToTwentyFourHour } = require('../../utils/timeHandler');

async function main() {
  const csvFileData = {
    data: []
  };
  const date = new Date().toLocaleDateString();
  const today = `${date.split('/')[2]}-${date.split('/')[0]}-${date.split('/')[1]}`;
  const fileName = `${date.split('/')[0]}-${date.split('/')[1]}-${date.split('/')[2].slice(-2)} Morning Report`;
  const yesterdayVariable = yesterday(today);
  const formattedDateToday = `${months[date.split('/')[0] - 1]} ${date.split('/')[1]} ${date.split('/')[2]}`;
  const formattedDateYesterday = `${months[yesterdayVariable.split('-')[1] - 1]} ${yesterdayVariable.split('-')[2]} ${yesterdayVariable.split('-')[0]}`;

  const queryToday = `SELECT *, CONVERT(NVARCHAR(MAX), [DateTime]) as date_string
      FROM [Accounts].[dbo].[8021_DavisAndCrump]
      WHERE CONVERT(NVARCHAR(MAX), [DateTime]) LIKE '${formattedDateToday}%'
      ORDER BY [DateTime] ASC`;

  const queryYesterday = `SELECT *, CONVERT(NVARCHAR(MAX), [DateTime]) as date_string
      FROM [Accounts].[dbo].[8021_DavisAndCrump]
      WHERE CONVERT(NVARCHAR(MAX), [DateTime]) LIKE '${formattedDateYesterday}%'
      ORDER BY [DateTime] ASC`;

  async function runQuery(query) {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      return result;
    } catch (err) {
      // ... error checks
      console.log(err);
      return ("catch block: " + err);
    }
  }

  sql.on('error', err => {
    // ... error handler
    return ("sql on: " + err);
  })
  const queryResultsToday = await runQuery(queryToday);
  const queryResultsYesterday = await runQuery(queryYesterday);
  let results = new Array();
  let timeOnly;

  for (let i = 0; i < queryResultsYesterday.length; i++) {
    timeOnly = twelveHourToTwentyFourHour(queryResultsYesterday[i].date_string.slice(-7).trim());
    if (timeOnly > 559) {
      results.push(queryResultsYesterday[i]);
    }
  }

  for (let i = 0; i < queryResultsToday.length; i++) {
    timeOnly = twelveHourToTwentyFourHour(queryResultsToday[i].date_string.slice(-7).trim());
    if (timeOnly < 600) {
      results.push(queryResultsToday[i]);
    }
  }

  let rawDate;
  let callDate;

  for(let i = 0; i < results.length; i++) {
    rawDate = new Date(results[i].DateTime);
    callDate = `${rawDate.getMonth() + 1}/${rawDate.getDate()}/${rawDate.getFullYear()}`
    // callDate = `${callDate.split('-')[1]}-${callDate.split('-')[2]}-${callDate.split('-')[0]}`;
    csvFileData.data[i] = {
      'PRODUCT CODE': results[i].Product,
      'CALL DATE': callDate,
      'FIRST NAME': results[i].FirstName,
      'LAST NAME': results[i].LastName,
      'ADD1': results[i].Address1,
      'ADD2': results[i].Address2,
      'CITY': results[i].City,
      'STATE': results[i].State,
      'ZIP': results[i].Zip,
      'PHONE': results[i].Phone1,
      'SECOND PHONE': results[i].Phone2,
      'EMAIL': results[i].Email,
      'c/o': results[i].CareOfFirstName,
      'care of last name': results[i].CareOfLastName,
      'source': results[i].Source,
      'Davis Feder Code': results[i].Product,
    }
  }

  let count = 1;
  let fileData;
  const keysLength = Object.keys(csvFileData.data[0]).length;
  const keys = Object.keys(csvFileData.data[0]);

  for(let i = 0; i < keysLength; i++) {
    if(keysLength == count) {
      fileData += `${keys[i].trim()}\n`;
    } else if(count == 1) {
      fileData = `${keys[i].trim()},`;
    } else {
      fileData += `${keys[i].trim()},`;
    }
    count++;
  }

  for(let x = 0; x < csvFileData.data.length; x++) {
    for(let y = 0; y < keysLength; y++) {
      if(csvFileData.data[x][keys[y]] == null) {
        csvFileData.data[x][keys[y]] = '';
      }
      if(y == keysLength-1) {
        fileData += `${csvFileData.data[x][keys[y]].trim()}\n`;
      } else {
        fileData += `${csvFileData.data[x][keys[y]].trim()},`;
      }
    }
  }
  
  return await {fileName: fileName, fileData: fileData};
}

module.exports = main;