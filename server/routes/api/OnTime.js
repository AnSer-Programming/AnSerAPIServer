const router = require('express').Router();
const storedProc = 'spSnapGraphLineOnTime';
const storedProcedure = '[dbo].[spSnapGraphLineOnTime]';
const config = require('../../config/connection');
const {Connection, Request} = require("tedious");
const sql = require('mssql');
const {parse, stringify, toJSON, fromJSON} = require('flatted');

const query = `Select 
DateName(month,dateadd(month,datepart(month, cast((dateadd(minute,Timestamp,-1)) as datetime)),0)-1) as 'Month',
Cast((sum(OnTime)/(sum(Loggedin)+1)) as decimal(10,2)) as 'PercentOn'
From 
[MDR].[dbo].[mOpLogout]
Left Join [accounts].[dbo].[02_Agents] on Opname = Agent_Login
Where
dateadd(minute,timestamp,'12/31/1899') > @StartDate
and dateadd(minute,timestamp,'12/31/1899') < @RunDate
and SuperTime = 0 
and not LogoutReason = 'Station Offline'
and Agent_Name = @Agent
Group By 
datepart(month, cast((dateadd(minute,Timestamp,-1)) as datetime))`;



router.get('/', async(req, res) => {
    (async function () {
        try {
            let pool = await sql.connect(config);
            let result1 = await pool.request().query(`SELECT * FROM Accounts.dbo.0_AnSer_Agents`);
                
            console.log(result1);
            res.send(result1);
        
            // Stored procedure
            
            // let result2 = await pool.request()
            //     .input('input_parameter', sql.Int, value)
            //     .output('output_parameter', sql.VarChar(50))
            //     .execute('procedure_name')
            
            // console.dir(result2)
        } catch (err) {
            // ... error checks
        res.send("catch block" + err);
        }
    })()
    
    sql.on('error', err => {
        // ... error handler
        res.send("sql on " + err);
    })
        // const executeSQL = (sql, callback) => {
    //     let connection = new Connection(config);
      
    //     connection.connect((err) => {
    //         if(err) {
    //             return callback(`Connection error: ${ err }`, null);
    //         }
    //         const request = new Request(sql, (err, rowCount, rows) => {
    //             connection.close();
      
    //             if(err) {
    //                 return callback(`Request error: ${ err }`, null);
    //             }
    //             callback(null, {rowCount, rows});
    //         });
      
    //         connection.execSql(request);
    //     });
        
    //     connection.close();
    // };
      
    // executeSQL(`Call ${ query }`, (err, data) => {
    //     if(err) {
    //         res.send(err);
    //     } else {
    //         res.send(data);
    //     }
      
    // });
    //console.log(`Data provided: ${ toJSON(data) }`);
    //res.send("test");
});

module.exports = router;