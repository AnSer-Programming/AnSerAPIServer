const schedule = require('node-schedule');
const email = require('../node-mailer/SendUndeliveredReport');
const data = require('./undeliveredMessageEvent');

schedule.scheduleJob('05 1 * * *', function () {
  const updateAccountsDB = require('./updateAccountListing');
  updateAccountsDB;
});

// Event for sending the undelivered reports VIA Email
// schedule.scheduleJob('00 14 * * *', async function() {
//   email(await data());
// });

// schedule.scheduleJob('00 18 * * *', async function() {
//   email(await data());
// });