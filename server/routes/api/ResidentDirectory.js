const router = require('express').Router();
const config = require('../../config/connection');
const sql = require('mssql');

router.get('/:accountNum', async(req, res) => {
    const query = `SELECT *
        FROM [dbo].[residentDirectory]
        WHERE [account_number] = '${req.params.accountNum}'
        ORDER BY [resident_full_name] ASC`;
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