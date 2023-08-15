const router = require('express').Router();
const timeConverterRoute = require('./TimeConverter');
const schedulerRoute = require('./Scheduler');
const billy = require('./Billy');
const onTimeRoute = require('./OnTime');
const contactDispatch = require('./ContactDispatch');
const vesselRoute = require('./Vessel');
const brainier = require('./Brainier/Index');

router.use('/Brainier', brainier);
router.use('/Billy', billy);
router.use('/OnTime', onTimeRoute);
router.use('/ContactDispatch', contactDispatch);
router.use('/scheduler', schedulerRoute);
router.use('/timeConverter', timeConverterRoute);
router.use('/Vessel', vesselRoute);

module.exports = router;