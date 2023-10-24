const config = require('../config/connectionProductionIS');
const configAPI = require('../config/connection');
const sql = require('mssql');

async function productionDBCall() {
    const query = `SELECT [ClientNumber]
        FROM [dbo].[cltClients]
        ORDER BY [ClientNumber] ASC`;

    try {
        const seq = require('sequelize') ;
        let result = await config.query(query, { type: seq.QueryTypes.SELECT }); 

        return result;
    } catch (err) {
        // ... error checks
        console.log(err);
        console.log("catch block: " + err);
    }
    
    sql.on('error', err => {
        // ... error handler
        console.log("sql on: " + err);
    })
}

async function apiDBCall() {
    const query = `SELECT [account]
        FROM [dbo].[contactDispatch]
        ORDER BY [account] ASC`;
    try {
        const seq = require('sequelize') ;
        let result = await configAPI.query(query, { type: seq.QueryTypes.SELECT }); 

        return result;
    } catch (err) {
        // ... error checks
        console.log(err);
        console.log("catch block: " + err);
    }
    
    sql.on('error', err => {
        // ... error handler
        console.log("sql on: " + err);
    })
}

async function apiDBPost(data) {
    for(let i = 0; i < data.length; i++) {
        const query = `INSERT INTO [dbo].[contactDispatch] (account)
            VALUES (${data[i].account})`;
        try {
            const seq = require('sequelize') ;
            let result = await configAPI.query(query, { type: seq.QueryTypes.SELECT });
        } catch (err) {
            // ... error checks
            console.log(err);
            console.log("catch block: " + err);
        }
        
        sql.on('error', err => {
            // ... error handler
            console.log("sql on: " + err);
        })
    }
}

async function apiDBDelete(data) {
    for(let i = 0; i < data.length; i++) {
        const query = `DELETE FROM [dbo].[contactDispatch]
            WHERE [account] = ${data[i].account}`;
        try {
            const seq = require('sequelize') ;
            let result = await configAPI.query(query, { type: seq.QueryTypes.SELECT });
        } catch (err) {
            // ... error checks
            console.log(err);
            console.log("catch block: " + err);
        }
        
        sql.on('error', err => {
            // ... error handler
            console.log("sql on: " + err);
        })
    }
}

async function main(){
    const productionData = await productionDBCall();
    const apiDBData = await apiDBCall();
    let counter = 0;
    let newData = [{}];
    let oldData = [{}];
    let found = false;

    for(let x = 0; x < productionData.length; x++) {
        found = false
        for(let y = 0; y < apiDBData.length; y++) {
            if(productionData[x].ClientNumber == apiDBData[y].account) {
                found = true;
                break;
            }
        }
        if(!found) {
            newData[counter] = {account: productionData[x].ClientNumber};
            counter++;
        }
    }

    counter = 0;

    for(let x = 0; x < apiDBData.length; x++) {
        found = false
        for(let y = 0; y < productionData.length; y++) {
            if(apiDBData[x].account == productionData[y].ClientNumber) {
                found = true;
                break;
            }
        }
        if(!found) {
            oldData[counter] = {account: apiDBData[x].account};
            counter++;
        }
    }

    if(newData.length > 1) {
        apiDBPost(newData);
    }

    if(oldData.length > 1) {
        apiDBDelete(oldData);
    }
}

main();