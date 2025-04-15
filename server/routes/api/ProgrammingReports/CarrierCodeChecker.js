const router = require('express').Router();

router.get('/', (req, res) => {
  res.send("Carrier Codes! 1R 5R and all of the made up codes!");
});

module.exports = router;