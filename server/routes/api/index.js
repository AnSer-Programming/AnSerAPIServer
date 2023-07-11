const router = require('express').Router();
const timeConverterRoute = require('./TimeConverter');
const schedulerRoute = require('./Scheduler');
const billy = require('./Billy');
const onTimeRoute = require('./OnTime');

router.use('/timeConverter', timeConverterRoute);
router.use('/Billy', billy);
router.use('/scheduler', schedulerRoute);
router.use('/OnTime', onTimeRoute);

module.exports = router;