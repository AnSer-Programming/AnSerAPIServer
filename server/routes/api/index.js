const router = require('express').Router();
const timeConverterRoute = require('./time-converter');

router.use('/timeConverter', timeConverterRoute);

module.exports = router;