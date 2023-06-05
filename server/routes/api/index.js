const router = require('express').Router();
const timeConverterRoute = require('./time-converter');
const schedulerRoute = require('./scheduler');
const billy = require('./Billy');

router.use('/timeConverter', timeConverterRoute);
router.use('/Billy', billy);
router.use('/scheduler', schedulerRoute);

module.exports = router;