const router = require('express').Router();
const timeConverterRoute = require('./TimeConverter');
const schedulerRoute = require('./Scheduler');
const billy = require('./Billy');
const onTimeRoute = require('./OnTime');
const vesselRoute = require('./Vessel');

router.use('/Billy', billy);
router.use('/OnTime', onTimeRoute);
router.use('/scheduler', schedulerRoute);
router.use('/timeConverter', timeConverterRoute);
router.use('/Vessel', vesselRoute);

module.exports = router;