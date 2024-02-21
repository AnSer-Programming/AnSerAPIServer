const router = require('express').Router();
const query = `SELECT [callId], CONVERT(varchar, [Stamp]) as "dateTime" ,[cltId] ,[TimezoneOffset] ,[stationNumber] ,[agtId]
    FROM [dbo].[statCallEnd]
    WHERE [Stamp] > DATEADD(hour, -24, CURRENT_TIMESTAMP) AND [stationType] = 0
    ORDER BY [Stamp] ASC`;
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async(req, res) => {
    (async function () {
        try {
            const seq = require('sequelize') ;
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

module.exports = router;