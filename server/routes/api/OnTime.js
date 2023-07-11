const router = require('express').Router();
const data = require('../../controllers/OnTime');

router.route('/').get(data.onTime);

module.exports = router;