const router = require('express').Router();
const query = `SELECT [stamp], [agtId], [initials], [stationType], [stationNumber], [type] 
    FROM [Intellegent].[dbo].[statAgentTracker] 
    WHERE [stationType] = 0 AND [stamp] > DATEADD(hour, -24, CURRENT_TIMESTAMP) 
    ORDER BY [stamp] ASC`;
const config = require('../../../config/connectionProductionCustom');
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