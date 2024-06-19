const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const configAPI = require('../../../config/connection');
const sql = require('mssql');

async function secondDBCall(primaryResult) {
  if (primaryResult) {
    // console.log(result[0].Source);
    let nextQuery = `SELECT [phone_number], [thinq], [pulsar], [nsight], [amtelco]
            FROM [isapi].[dbo].[didSources]`;

    try {
      const seq = require('sequelize');
      const compareResult = await configAPI.query(nextQuery, { type: seq.QueryTypes.SELECT });

      return await compareResult;
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  }
}

router.get('/', async (req, res) => {
  const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
        ORDER BY [ClientNumber] ASC`;

  (async function () {
    try {
      let results;
      results = { ActiveDID: [{}], NotActiveDID: {} };
      const seq = require('sequelize');
      const primaryResult = await config.query(query, { type: seq.QueryTypes.SELECT });

      const compareResult = await secondDBCall(primaryResult);

      for (let x = 0; x < primaryResult.length; x++) {
        for (let y = 0; y < compareResult.length; y++) {
          if (compareResult[y].phone_number == primaryResult[x].Source) {
            if (compareResult[y].thinq) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "ThinQ";
              compareResult.splice(y, 1);
            } else if (compareResult[y].pulsar) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Pulsar";
              compareResult.splice(y, 1);
            } else if (compareResult[y].nsight) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Nsight";
              compareResult.splice(y, 1);
            } else if (compareResult[y].amtelco) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Amtelco";
              compareResult.splice(y, 1);
            }
            break;
          } else if (y === compareResult.length - 1) {
            results.ActiveDID[x] = primaryResult[x];
            results.ActiveDID[x].Provider = "Unknown";
          }
        }
      }

      results.NotActiveDID = compareResult;
      res.json(results);
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

router.get('/ByAccountNum/:accountNum', async (req, res) => {
  let accountNum = req.params.accountNum;
  const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
        WHERE [ClientNumber] = :accountNum
        ORDER BY [ClientNumber] ASC`;
  (async function () {
    try {
      let results;
      const seq = require('sequelize');
      const primaryResult = await config.query(query, { replacement: {accountNum: accountNum}, type: seq.QueryTypes.SELECT });
      results = { ActiveDID: [{}], NotActiveDID: {} };

      const compareResult = await secondDBCall(primaryResult);

      for (let x = 0; x < primaryResult.length; x++) {
        for (let y = 0; y < compareResult.length; y++) {
          if (compareResult[y].phone_number == primaryResult[x].Source) {
            if (compareResult[y].thinq) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "ThinQ";
              compareResult.splice(y, 1);
            } else if (compareResult[y].pulsar) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Pulsar";
              compareResult.splice(y, 1);
            } else if (compareResult[y].nsight) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Nsight";
              compareResult.splice(y, 1);
            } else if (compareResult[y].amtelco) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Amtelco";
              compareResult.splice(y, 1);
            }
            break;
          } else if (y === compareResult.length - 1) {
            results.ActiveDID[x] = primaryResult[x];
            results.ActiveDID[x].Provider = "Unknown";
          }
        }
      }

      results.NotActiveDID = compareResult;

      res.json(results);
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

router.get('/ByAccountName/:accountName', async (req, res) => {
  let accountName = req.params.accountName;
  const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
        WHERE [ClientName] LIKE :accountName
        ORDER BY [ClientNumber] ASC`;
  (async function () {
    try {
      let results;
      const seq = require('sequelize');
      const primaryResult = await config.query(query, { replacements: { accountName: `%${accountName}%`}, type: seq.QueryTypes.SELECT });
      results = { ActiveDID: [{}], NotActiveDID: {} };

      const compareResult = await secondDBCall(primaryResult);

      for (let x = 0; x < primaryResult.length; x++) {
        for (let y = 0; y < compareResult.length; y++) {
          if (compareResult[y].phone_number == primaryResult[x].Source) {
            if (compareResult[y].thinq) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "ThinQ";
              compareResult.splice(y, 1);
            } else if (compareResult[y].pulsar) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Pulsar";
              compareResult.splice(y, 1);
            } else if (compareResult[y].nsight) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Nsight";
              compareResult.splice(y, 1);
            } else if (compareResult[y].amtelco) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Amtelco";
              compareResult.splice(y, 1);
            }
            break;
          } else if (y === compareResult.length - 1) {
            results.ActiveDID[x] = primaryResult[x];
            results.ActiveDID[x].Provider = "Unknown";
          }
        }
      }

      results.NotActiveDID = compareResult;
      res.json(results);
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

router.get('/BySource/:sourceNum', async (req, res) => {
  let sourceNum = req.params.sourceNum;
  const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
        WHERE [Source] LIKE :sourceNum
        ORDER BY [ClientNumber] ASC`;
  (async function () {
    try {
      let results;
      const seq = require('sequelize');
      const primaryResult = await config.query(query, { replacements: {sourceNum: `${sourceNum}%`}, type: seq.QueryTypes.SELECT });
      results = { ActiveDID: [{}], NotActiveDID: {} };

      const compareResult = await secondDBCall(primaryResult);

      for (let x = 0; x < primaryResult.length; x++) {
        for (let y = 0; y < compareResult.length; y++) {
          if (compareResult[y].phone_number == primaryResult[x].Source) {
            if (compareResult[y].thinq) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "ThinQ";
              compareResult.splice(y, 1);
            } else if (compareResult[y].pulsar) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Pulsar";
              compareResult.splice(y, 1);
            } else if (compareResult[y].nsight) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Nsight";
              compareResult.splice(y, 1);
            } else if (compareResult[y].amtelco) {
              results.ActiveDID[x] = primaryResult[x];
              results.ActiveDID[x].Provider = "Amtelco";
              compareResult.splice(y, 1);
            }
            break;
          } else if (y === compareResult.length - 1) {
            results.ActiveDID[x] = primaryResult[x];
            results.ActiveDID[x].Provider = "Unknown";
          }
        }
      }

      results.NotActiveDID = compareResult;
      res.json(results);
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

module.exports = router;