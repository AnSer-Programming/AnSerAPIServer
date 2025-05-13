const configIS = require('../../config/connectionProductionIS');
const configAPI = require('../../config/connection');
const sql = require('mssql');
const seq = require('sequelize');
const { day_month_year } = require('../../utils/dateHandler');

async function getAccountNumbers() { //Pull every account that we currently have in IS (this will do agent, test, live, and dead accounts)
  let query = `SELECT DISTINCT [ClientNumber]
        FROM [Intellegent].[dbo].[cltClients]
        ORDER BY [ClientNumber] ASC`;
  try {
    let result = await configIS.query(query, { type: seq.QueryTypes.SELECT });     
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function runGetQuery(accountNum) { //To help the program I am setting it to do one account at a time
  let query = `SELECT [id], [cltfieldID], [ClientNumber], fields.[cltID], [Field]
                FROM [Intellegent].[dbo].[dirListingFields] fields
                LEFT JOIN [Intellegent].[dbo].[cltClients] client ON client.[cltId] = fields.[cltID]
                WHERE fields.[cltID] IS NOT NULL AND [ClientNumber] = :accountNum
                ORDER BY [cltfieldID] ASC`;
  try {
    let result = await configIS.query(query, { replacements: { accountNum: accountNum }, type: seq.QueryTypes.SELECT });     
    return result;
  } catch (err) {
    // ... error checks
    console.log(err);
  }
}

async function runPostQuery(data) {
  const date = day_month_year(); //Get a Month+Year pattern to put help organize the database table
  let infoPageData;
  let query;
  let result; 
  try {
    for(let i = 0; i < data.length; i++) { //Iterate through each info page
      clientSharedFieldData = data[i].Field.trim(); //remove white space
      if(clientSharedFieldData) {
        clientSharedFieldData = clientSharedFieldData.replace(/'/g, '"'); //remove the single quote because it is a utility character in SQL
      }
      query = `INSERT INTO [isapi].[dbo].[monthlyClientSharedFieldsBackUp] (clt_id, client_number, client_shared_field_id, client_shared_field_data, date_added) 
        VALUES (${data[i].cltID}, ${data[i].ClientNumber}, ${data[i].cltfieldID}, '${clientSharedFieldData}', '${date}')`;
      result = await configAPI.query(query, { type: seq.QueryTypes.SELECT });
    }   
    return result;
  } catch (err) {
    // ... error checks
    console.log("catch block: " + err);
  }
}

async function main() {
  let accountNumbers = await getAccountNumbers();
  let results;
  for(let i = 0; i < accountNumbers.length; i++) {
    results = await runGetQuery(accountNumbers[i].ClientNumber);
    results = await runPostQuery(results);
  }
}

module.exports = main;