const config = require('../config/connectionProductionIS');
const sql = require('mssql');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isHoliday = async(accountNum, date) => {
  const query = `SELECT holidays.[Start]
        FROM [Intellegent].[dbo].[cltHolidays] cltHoliday
        LEFT JOIN [Intellegent].[dbo].[cltClients] clients ON cltHoliday.[cltId] = clients.[cltId]
        LEFT JOIN [Intellegent].[dbo].[sysHolidays] holidays ON cltHoliday.[holidayId] = holidays.[holidayId]
        WHERE [ClientNumber] LIKE :accountNum
        ORDER BY [ClientNumber] ASC`;

  async function runQuery () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { replacements: { accountNum: `${accountNum}` }, type: seq.QueryTypes.SELECT });

      return(await result);
    } catch (err) {
      // ... error checks
      console.log(err);
      return("catch block: " + err);
    }
  }

  sql.on('error', err => {
    // ... error handler
    return("sql on: " + err);
  })
  
  const holidays = await runQuery();
  const formattedHolidays = new Array();
  let monthNum;
  let dayNum;
  let yearNum;
  for(let i = 0; i < holidays.length; i++) {
    for(let x = 0; x < months.length; x++) {
      if(`${holidays[i].Start}`.split(' ')[1] == months[x]) {
        monthNum = x+1;
        if(`${monthNum}`.length == 1) {
          monthNum = `0${monthNum}`;
        }
        dayNum = `${holidays[i].Start}`.split(' ')[2];
        if(`${dayNum}`.length == 1) {
          dayNum = `0${dayNum}`;
        }
        yearNum = `${holidays[i].Start}`.split(' ')[3];
        formattedHolidays.push(`${yearNum}-${monthNum}-${dayNum}`);
      }
    }
  }

  for(let i = 0; i < formattedHolidays.length; i++) {
    if(formattedHolidays[i] == date) {
      return true;
    }
  }
  return false;
}

module.exports = { isHoliday }