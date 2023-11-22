const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');

router.get('/:accountNum', async(req, res) => {
    let newObj;
    let accountNum = req.params.accountNum;
    let result = new Array;
    let counter = 0;
    let query = `SELECT [subId]
        FROM [dbo].[cltClients]
        WHERE [ClientNumber] = ${accountNum}
        ORDER BY [ClientNumber] ASC`;

    async function runQuery() {
        try {
            const seq = require('sequelize') ;
            result = await config.query(query, { type: seq.QueryTypes.SELECT }); 

            return result;
        } catch (err) {
            // ... error checks
            console.log(err);
            res.send("catch block: " + err);
        }
    }

    result = await runQuery();
    if(result[0]) {
        if(result[0].subId == null) {
            res.json("Unavailable");
        } else {            
            query = `SELECT [id]
                        ,[Intellegent].[dbo].[dirListingFields].[listId]
                        ,[Intellegent].[dbo].[dirListingFields].[subfieldId]
                        ,[Intellegent].[dbo].[dirListingFields].[subId]
                        ,[searchField]
                        ,[Title]
                    FROM [Intellegent].[dbo].[dirListingFields]
                    LEFT JOIN [Intellegent].[dbo].[dirViewFields] on [Intellegent].[dbo].[dirViewFields].[subfieldId] = [Intellegent].[dbo].[dirListingFields].[subfieldId]
                    WHERE [Intellegent].[dbo].[dirListingFields].[subId] = ${result[0].subId}
                    ORDER BY [Intellegent].[dbo].[dirListingFields].[listId], [subfieldId] ASC`;
            
            placeHolder = await runQuery();
    
            for(let i = 0; i < placeHolder.length; i++) {
                if(!newObj) {
                    query = `SELECT [info]
                        FROM [Intellegent].[dbo].[dirListings]
                        WHERE [Intellegent].[dbo].[dirListings].[listId] = ${placeHolder[i].listId}`;
                    info = await runQuery();
                    info[0].info = info[0].info.replace(/\n/g, " ").replace(/\r/g, "").replace(/\t/g, "").replace(/\v/g, "");
                    newObj = [{}];
                    newObj[0].listID = placeHolder[i].listId;
                    newObj[0].InfoCard = info[0].info;
                    newObj[0][placeHolder[i].Title] = placeHolder[i].searchField;
                } else if(newObj[counter].listID != placeHolder[i].listId) {
                    query = `SELECT [info]
                        FROM [Intellegent].[dbo].[dirListings]
                        WHERE [Intellegent].[dbo].[dirListings].[listId] = ${placeHolder[i].listId}`;
                    info = await runQuery();
                    info[0].info = info[0].info.replace(/\n/g, " ").replace(/\r/g, "").replace(/\t/g, "").replace(/\v/g, "");
                    counter++;
                    newObj[counter] = {};
                    newObj[counter].listID = placeHolder[i].listId;
                    newObj[counter].InfoCard = info[0].info;
                    newObj[counter][placeHolder[i].Title] = placeHolder[i].searchField;
                }
                newObj[counter][placeHolder[i].Title] = placeHolder[i].searchField;
            }
    
            res.json(newObj);
        }
    }

    sql.on('error', err => {
        // ... error handler
        res.send("sql on: " + err);
    })
});

module.exports = router;