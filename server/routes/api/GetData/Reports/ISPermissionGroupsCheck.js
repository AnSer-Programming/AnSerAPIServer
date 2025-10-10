const router = require('express').Router();
const config = require('../../../../config/connectionProductionIS');
const sql = require('mssql');
const { groupCheck } = require('../../../../utils/groupCheckIS');

async function getData() {
  const query = `SELECT 
    client.[cltId], client.[ClientNumber], client.[ClientName], directories.[Name] AS directoryName, client.[subId], directoryViews.[Name] AS viewName, 
      pmView.[viewId], pmView.[pmId], groups.[Name] AS groupName
  FROM [Intellegent].[dbo].[cltClients] client
  LEFT JOIN [Intellegent].[dbo].[dirSubjects] directories ON directories.[subId] = client.[subId]
  LEFT JOIN [Intellegent].[dbo].[dirViews] directoryViews ON directories.[subId] = directoryViews.[subId]
  LEFT JOIN [Intellegent].[dbo].[pmViews] pmView ON directoryViews.[viewId] = pmView.[viewId]
  LEFT JOIN [Intellegent].[dbo].[pmPermissionGroups] groups ON groups.[pmId] = pmView.[pmId]
  WHERE client.[subId] IS NOT NULL
  ORDER BY directoryName, viewName, groupName ASC`;

  async function runQuery() {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      return (await groupCheck(result));
    } catch (err) {
      // ... error checks
      console.log(err);
      return ({ catchBlock: err });
    }
  }

  sql.on('error', err => {
    // ... error handler
    return ({ sqlOn: err });
  })

  return await runQuery();
}

router.get('/getByDirectoryName', async (req, res) => {
  let results;
  results = await getData();
  res.json(results);
});

router.get('/getByMissingPermissionGroup', async (req, res) => {
  let results;
  let customerSupport = new Array();
  let operators = new Array();
  let programming = new Array();
  let supervisors = new Array();
  let other = new Array();
  let view;
  let json;
  results = await getData();

  for (let key in results) {
    for (let i = 0; i < results[`${key}`].length; i++) {
      for (let group in results[`${key}`][i]) {
        if (group == 'customerSupport') {
          customerSupport[customerSupport.length] = {view: view, directory: key};
        } else if (group == 'operators') {
          operators[operators.length] = {view: view, directory: key};
        } else if (group == 'programming') {
          programming[programming.length] = {view: view, directory: key};
        } else if (group == 'supervisors') {
          supervisors[supervisors.length] = {view: view, directory: key};
        } else if(group == 'viewName'){
          view = results[`${key}`][i].viewName;
        } else {
          other[other.length] = {view: view, directory: key};
        }
      }
    }
  }
  json = { customerSupport: customerSupport, programming: programming, operators: operators, supervisors: supervisors, other: other };

  res.json(json);
});

module.exports = router;