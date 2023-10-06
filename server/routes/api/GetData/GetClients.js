const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async(req, res) => {
    const query = `SELECT [ClientNumber], [ClientName]
        FROM [dbo].[cltClients]
        ORDER BY [ClientNumber] ASC`;
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