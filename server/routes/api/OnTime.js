const router = require('express').Router();
const storedProc = 'spSnapGraphLineOnTime';
const storedProcedure = '[dbo].[spSnapGraphLineOnTime]';
const config = require('../../config/connection');
const {Connection, Request} = require("tedious");
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
datepart(month, cast((dateadd(minute,Timestamp,-1)) as datetime))`



router.get('/', async(req, res) => {
    const executeSQL = async (sql, callback) => {
        let connection = new Connection(config);
      
        connection.connect((err) => {
            if(err) {
                return callback(`Connection error: ${ err }`, null);
            }
            const request = new Request(sql, (err, rowCount, rows) => {
                connection.close();
      
                if(err) {
                    return callback(`Request error: ${ err }`, null);
                }
                callback(null, {rowCount, rows});
            });
      
            connection.execSql(request);
        });
    };
      
    executeSQL("SELECT * FROM users", (err, data) => {
        if(err) {
            res.send(err);
        }
      
        res.send(data);
    });
    //console.log(`Data provided: ${ toJSON(data) }`);
    //res.send("test");
});

module.exports = router;