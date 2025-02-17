const router = require('express').Router();
const config = require('../../config/connection');
const sql = require('mssql');
const seq = require('sequelize');

router.get('/GetData', async (req, res) => {
  const query = `SELECT * FROM [isapi].[dbo].[contactDispatch]`;
  try {
    const contactDispatch = await config.query(query, { type: seq.QueryTypes.SELECT });

    res.status(200).json(contactDispatch);
  } catch (err) {
    console.log(`Contact Dispatch Error: ${err}`);
    res.status(500).json(err);
  }
});

router.put('/ByID/:id', async (req, res) => {
  // update a category by its `id` value
  const query = `UPDATE [isapi].[dbo].[contactDispatch] 
    SET 
      initials = :initials, 
      start_date = :start_date, 
      review_sent_date = :review_sent_date, 
      reviewer_initials = :reviewer_initials, 
      review_complete_date = :review_complete_date, 
      completion_date = :completion_date
    WHERE
      id = ${req.params.id}`;
  try {
    const contactDispatch = await config.query(query, { 
      type: seq.QueryTypes.UPDATE,
      replacements: {
        initials: req.body.initials ? req.body.initials : null, 
        start_date: req.body.start_date ? req.body.start_date : null, 
        review_sent_date: req.body.review_sent_date ? req.body.review_sent_date : null, 
        reviewer_initials: req.body.reviewer_initials ? req.body.reviewer_initials : null, 
        review_complete_date: req.body.review_complete_date ? req.body.review_complete_date : null, 
        completion_date: req.body.completion_date ? req.body.review_complete_date : null
      }
    });
    if(!contactDispatch[0]) {
      res.status(404).json({ message: `Index Error!` });
      return;
    }

    res.status(200).json(contactDispatch);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;