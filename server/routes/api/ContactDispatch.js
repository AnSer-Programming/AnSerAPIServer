const router = require('express').Router();
const data = require('../../controllers/ContactDispatch');

router.route('/').get(data.getContactDispatch);
router.route('/:groupNum').get(data.getGroupContactDispatch);
router.route('/UpdateClients').put(data.setContactDispatch);

module.exports = router;