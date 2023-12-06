const router = require('express').Router();
const config = require('../../../config/connectionProductionLegacy');
const sql = require('mssql');

router.get('/:fileName', async (req, res) => {
  let fileName = req.params.fileName;
  if(fileName) {
    if(fileName[fileName.length-4] === '.'){
      fileName = fileName.slice(0, fileName.length-4);
    }

    callID = fileName.slice(fileName.length-8, fileName.length);

    const query = `SELECT [ID], [agtId], [cltId], [Call], [Account], [OrgAccount], [Client], [MDR].[dbo].[mCallSegment].[Initials], [Agent_Name]
          FROM [MDR].[dbo].[mCallSegment]
          LEFT JOIN [Accounts].[dbo].[02_Agents] ON [MDR].[dbo].[mCallSegment].[Initials] = [Accounts].[dbo].[02_Agents].[Initials]
          LEFT JOIN [Intellegent].[dbo].[cltClients] ON [MDR].[dbo].[mCallSegment].[Account] = [Intellegent].[dbo].[cltClients].[ClientNumber]
          WHERE [Call] = '${callID}'`; 

    async function runQuery(query) {
      try {
        const seq = require('sequelize');
        let result = await config.query(query, { type: seq.QueryTypes.SELECT });
    
        res.json(result);
      } catch (err) {
        // ... error checks
        console.log(err);
        res.send("catch block: " + err);
      }
    }

    runQuery(query);

    sql.on('error', err => {
      // ... error handler
      res.send("sql on: " + err);
    })
  }
});

module.exports = router;