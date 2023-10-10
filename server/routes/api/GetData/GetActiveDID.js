const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/', async(req, res) => {
    const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
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

router.get('/ByAccountNum/:accountNum', async(req, res) => {
    let accountNum = req.params.accountNum;
    const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
        WHERE [ClientNumber] = ${accountNum}
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

router.get('/ByAccountName/:accountName', async(req, res) => {
    let accountName = req.params.accountName;
    const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
        WHERE [ClientName] LIKE '%${accountName}%'
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

router.get('/BySource/:sourceNum', async(req, res) => {
    let sourceNum = req.params.sourceNum;
    const query = `SELECT [Source], [ClientNumber], [ClientName]
        FROM [Intellegent].[dbo].[cltSources]
        LEFT JOIN [dbo].[cltClients] on [dbo].[cltSources].[cltId] = [dbo].[cltClients].[cltId]
        WHERE [Source] LIKE '${sourceNum}%'
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