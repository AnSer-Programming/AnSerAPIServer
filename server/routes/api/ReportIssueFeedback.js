const router = require('express').Router();
const SendFeedback = require('../../node-mailer/SendFeedback')

router.post('/', async (req, res) => {
  try {
    if(req.body) {
      SendFeedback(req.body);
  
      res.status(200);
    } else {
      res.status(400);
    }
  } catch(err) {
    console.log(err);
    res.status(500);
  }
});

module.exports = router;