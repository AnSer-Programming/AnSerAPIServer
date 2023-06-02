const router = require('express').Router();
const timeConverterRoute = require('./time-converter');
const scheduler = require('./scheduler');

router.use('/timeConverter', timeConverterRoute);

module.exports = router;