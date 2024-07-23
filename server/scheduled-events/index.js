const schedule = require('node-schedule');
// const sendEmail = require('../node-mailer/index');
const sendUndeliveredReport = require('../node-mailer/SendUndeliveredReport');
const undeliveredMessages = require('./undeliveredMessageEvent');
const SendDirectoriesWithoutOverrides = require('../node-mailer/SendDirectoriesWithoutOverrides');
const directoriesMissingOverrides = require('./directoriesMissingOverrides');
const SendDirectoriesInWrongStatusCheckinMode = require('../node-mailer/SendDirectoriesInWrongStatusCheckinMode');
const directoriesWrongStatusCheckinMode = require('./directoriesWrongStatusCheckinMode');

// Update active accounts to the API Database
schedule.scheduleJob('05 1 * * *', function () {
  const updateAccountsDB = require('./updateAccountListing');
  updateAccountsDB;
});

// Automated Reports
schedule.scheduleJob('00 07 01 * *', async function () {
  SendDirectoriesWithoutOverrides(await directoriesMissingOverrides());
});

schedule.scheduleJob('00 07 01 * *', async function () {
  // directoriesWrongStatusCheckinMode();
  SendDirectoriesInWrongStatusCheckinMode(await directoriesWrongStatusCheckinMode());
});

//Test
// schedule.scheduleJob('10 38 17 * * *', async function () {
//   SendDirectoriesWithoutOverrides(await directoriesMissingOverrides());
// });

// Event for sending the undelivered reports VIA Email
// schedule.scheduleJob('00 14 * * *', async function() {
//   sendUndeliveredReport(await undeliveredMessages());
// });

// schedule.scheduleJob('00 18 * * *', async function() {
//   sendUndeliveredReport(await undeliveredMessages());
// });