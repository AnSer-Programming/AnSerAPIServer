const schedule = require('node-schedule');

schedule.scheduleJob('05 1 * * *', function () {
  const updateAccountsDB = require('./updateAccountListing');
  updateAccountsDB;
});

// Event for sending the undelivered reports VIA Email
schedule.scheduleJob('00 19 * * *', async function() {
  const email = require('../node-mailer/SendUndeliveredReport');
  const main = require('./undeliveredMessageEvent');
  console.log(await main());
  email(await main());
});

schedule.scheduleJob('00 23 * * *', async function() {
  const email = require('../node-mailer/SendUndeliveredReport');
  const main = require('./undeliveredMessageEvent');
  console.log(await main());
  email(await main());
});