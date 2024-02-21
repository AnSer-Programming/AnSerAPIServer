const schedule = require('node-schedule');

schedule.scheduleJob('05 1 * * *', function () {
  const updateAccountsDB = require('./updateAccountListing');
  updateAccountsDB;
});