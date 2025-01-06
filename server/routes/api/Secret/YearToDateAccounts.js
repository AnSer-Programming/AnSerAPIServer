const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async (req, res) => {
  const query = `SELECT [msgId]
                ,[cltId]
                ,[Stamp]
                ,[Taken]
                ,[Index]
                ,[Summary]
            FROM [Intellegent].[dbo].[msgMessages]
            WHERE [cltId] = 1052 AND [Index] != ' ' AND [Stamp] > DATEADD(year, -1, GETDATE())
            ORDER BY [Stamp] DESC`;

  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      res.json(result);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  })()

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

router.get('/Count', async (req, res) => {
  const query = `SELECT [Index], COUNT([Index]) AS [Total Within A Year]
                FROM [Intellegent].[dbo].[msgMessages]
                WHERE [cltId] = 1052 AND [Index] != ' ' AND [Stamp] > DATEADD(year, -1, GETDATE())
                GROUP BY [Index]`;

  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      res.json(result);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  })()

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

//Account range
router.get('/:startRange/:endRange', async (req, res) => {
  const startRange = req.params.startRange;
  const endRange = req.params.endRange;
  const query = `SELECT [msgId]
                ,[cltId]
                ,[Stamp]
                ,[Taken]
                ,[Index]
                ,[Summary]
            FROM [Intellegent].[dbo].[msgMessages]
            WHERE [cltId] = 1052 AND [Index] != ' ' AND [Stamp] > DATEADD(year, -1, GETDATE())
            ORDER BY [Stamp] DESC`;

  async function executeSQL() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      const data = JSON.parse(JSON.stringify(result));
      let newData = new Array();
      let returnData = {
        AccountData: [],
      };

      for(let i = 0; i < data.length; i++) {
        newData[i] = await { AccountNum: data[i].Summary.replace(`${data[i].Index}\r\n`, '').split(' ')[0], Index: data[i].Index, TimeStamp: data[i].Stamp }
      }

      for(let i = 0; i < newData.length; i++) {
        if(parseInt(newData[i].AccountNum) > startRange && parseInt(newData[i].AccountNum) < endRange) {
          returnData.AccountData[returnData.AccountData.length] = newData[i];
          if(returnData[newData[i].Index]) {
            returnData[newData[i].Index] += 1;
          } else {
            returnData[newData[i].Index] = 1;
          }
        }
      }

      res.json(returnData);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }

  await executeSQL();

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  })
});

module.exports = router;