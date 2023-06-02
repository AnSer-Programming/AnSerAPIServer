const router = require('express').Router();
const timeConverterRoute = require('./time-converter');
const scheduler = require('./scheduler');
const billy = require('./Billy');

router.use('/timeConverter', timeConverterRoute);
router.use('/Billy', billy);

module.exports = router;