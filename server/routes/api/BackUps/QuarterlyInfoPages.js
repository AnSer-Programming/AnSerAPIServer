const router = require('express').Router();

router.get('/', (req, res) => {
  res.send("Quarterlies!");
});

module.exports = router;