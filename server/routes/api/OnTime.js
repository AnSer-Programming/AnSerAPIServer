const router = require('express').Router();
const storedProcedure = '[dbo].[spSnapGraphLineOnTime]';
const config = require('../../config/connectionProductionCustom');
const sql = require('mssql');
const {parse, stringify, toJSON, fromJSON} = require('flatted'); // Only use on storedProcedures

router.get('/', async(req, res) => {
    (async function () {
        try {
            const objID = 'JSON_F52E2B61-18A1-11d1-B105-00805F49916B';
            const seq = require('sequelize') ;
            let result = await config.query(`EXEC ${storedProcedure}`, { type: seq.QueryTypes.SELECT }); 
            let array = toJSON(result);
            array = JSON.parse(array[2]);    

            res.json(array);
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