const router = require('express').Router();
const data = require('../../controllers/ContactDispatch');
const config = require('../../config/connection');
const sql = require('mssql');

router.route('/').get(data.getContactDispatch);
router.route('/:groupNum').get(data.getGroupContactDispatch);
router.put('/updateClient', async (req, res) => {
  console.log(req.body);
  const query = `UPDATE [dbo].[contactDispatch]
        SET [status] = '${req.body.data.status}'
        WHERE [account] = ${req.body.data.account}`;//, [account_type] = ${req.body.data.account_type}, [api] = ${req.body.data.api}
  (async function () {
    try {
      const seq = require('sequelize');
      let result = await config.query(query, { type: seq.QueryTypes.SELECT });

      res.json(result);
    } catch (err) {
      // ... error checks
      console.log(err);
      res.send("catch block: " + err);
    }
  })()

  sql.on('error', err => {
    // ... error handler
    res.send("sql on: " + err);
  });
})

module.exports = router;