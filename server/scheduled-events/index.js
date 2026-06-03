const schedule = require('node-schedule');
const dotenv = require("dotenv");

dotenv.config();

// const sendEmail = require('../node-mailer/index');

/* 
*  Dead Features
  const contactDispatchEmail = require('../node-mailer/ContactDispatchEmail/SendContactDispatchReport');
  const contactDispatchReport = require('./ContactDispatchReports/contactDispatchReport');
  const sendUndeliveredReport = require('../node-mailer/SendUndeliveredReport');
  const undeliveredMessages = require('./undeliveredMessageEvent');
  Update active accounts to the API Database
  schedule.scheduleJob('05 1 * * *', function () {
  if(process.env.SERVER_TYPE == "production") {
    const updateAccountsDB = require('./updateAccountListing');
    updateAccountsDB;
    }
  }); 
*/

// Internal System Maintenance Checks
const SendDirectoriesWithoutOverrides = require('../node-mailer/SendDirectoriesWithoutOverrides');//Send Data
const directoriesMissingOverrides = require('./directoriesMissingOverrides');//Generate Data
const SendDirectoriesInWrongStatusCheckinMode = require('../node-mailer/SendDirectoriesInWrongStatusCheckinMode');//Send Data
const directoriesWrongStatusCheckinMode = require('./directoriesWrongStatusCheckinMode');//Generate Data

// Davis And Crump
const SendCSVToDavisAndCrumpEmail = require('../node-mailer/emailToClient/SendCSVToDavisAndCrump'); //Send Data
const davisAndCrump = require('./automatedReportsToClient/davisAndCrump'); //Generate Data

// BackUp Info Page Data
const infoPages = require('./BackUps/infoPagesBackup');//Add Info Pages To Back Ups DB Table
const clientSharedFields = require('./BackUps/clientSharedFieldsBackup');//Add Client Shared Fields To Back Ups DB Table

// QGenda
const SendNewProvider = require('../node-mailer/QGenda/SendEmailOfNewProviders');//Send Data
const AdjustDatabaseData = require('./QGenda/AdjustDatabaseData');


// Automated Reports
schedule.scheduleJob('00 07 01 * *', async function () {//Execute at 7:00AM on The First of Every Month
  if (process.env.SERVER_TYPE == "production") {
    SendDirectoriesWithoutOverrides(await directoriesMissingOverrides());
  }
});

schedule.scheduleJob('00 07 01 * *', async function () {//Execute at 7:00AM on The First of Every Month
  if (process.env.SERVER_TYPE == "production") {
    SendDirectoriesInWrongStatusCheckinMode(await directoriesWrongStatusCheckinMode());
  }
});

// Info Page Data Back Up
schedule.scheduleJob('00 02 01 * *', async function () { // run at 2AM on the first of every month
  if (process.env.SERVER_TYPE == "production") {
    infoPages();
    clientSharedFields();
  }
});

schedule.scheduleJob('00 02 15 * *', async function () { // run at 2AM on the fifteenth of every month
  if (process.env.SERVER_TYPE == "production") {
    infoPages();
    clientSharedFields();
  }
});

// Davis And Crump
schedule.scheduleJob('00 06 * * *', async function () { // run at 6:00AM every day
  if (process.env.SERVER_TYPE == "production") {
    SendCSVToDavisAndCrumpEmail(await davisAndCrump());
  }
});

// QGenda
schedule.scheduleJob('00 04 * * 1', async function () { //Run every Monday at 4:00AM
  const { main } = require('./QGenda/EvaluateData');
  const localData = await require('./QGenda/GetDatabaseData');
  const qgendaData = await require('./QGenda/GetProviders');
  const updateData = await main(localData, qgendaData);
  await AdjustDatabaseData(updateData);
    // SendNewProvider(
    //   {
    //     "fileName": "QGendaTestData",
    //     "fileData": "FirstName,LastName,StaffKey,DateAdded,DateInactive,Active,DateAdjusted\r\nBob,Evans,123asdf456qwer789,2026-05-27,NULL,True,2026-05-27\r\n"

    //   }
    // );
});

// schedule.scheduleJob('*/5 * * * * *', async function () { // test email
//   console.log("Test");
//   contactDispatchEmail(await contactDispatchReport());
//   if(process.env.SERVER_TYPE == "production") {
//   contactDispatchEmail(await contactDispatchReport());
//   }
// });


//Test
// schedule.scheduleJob('15 * * * * *', async function () {
  // const { main } = require('./QGenda/EvaluateData');
  // console.log("run");
  // const localData = await require('./QGenda/GetDatabaseData');
  // const qgendaData = await require('./QGenda/GetProviders');
  // const updateData = await main(localData, qgendaData);
  // await AdjustDatabaseData(updateData);
//   SendNewProvider(
//     {
//       "fileName": "QGendaTestData",
//       "fileData": "FirstName,LastName,StaffKey,DateAdded,DateInactive,Active,DateAdjusted\r\nBob,Evans,123asdf456qwer789,2026-05-27,NULL,True,2026-05-27\r\n"
//     }
//   );
// });

// Event for sending the undelivered reports VIA Email
// schedule.scheduleJob('00 14 * * *', async function() {
//   sendUndeliveredReport(await undeliveredMessages());
// });

// schedule.scheduleJob('00 18 * * *', async function() {
//   sendUndeliveredReport(await undeliveredMessages());
// });