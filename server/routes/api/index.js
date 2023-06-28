const router = require('express').Router();
const timeConverterRoute = require('./time-converter');
const schedulerRoute = require('./scheduler');
const billy = require('./Billy');
const onTimeRoute = require('./OnTime');

router.use('/timeConverter', timeConverterRoute);
router.use('/Billy', billy);
router.use('/scheduler', schedulerRoute);
router.use('/OnTime', onTimeRoute);

module.exports = router;