const router = require('express').Router();
const config = require('../../../config/connectionProductionIS');
const sql = require('mssql');
const dotenv = require("dotenv");

dotenv.config();

router.get('/', async (req, res) => {
  let returnData = "Test";
  let token = "Test";
  let data = {
    'email': `${process.env.QGENDA_EMAIL}`,
    'password': `${process.env.QGENDA_PWD}`,
  }

  try {
    token = await fetch(`https://api.qgenda.com/v2/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
    });

    let bearerToken = await token.json();
  
    returnData = await fetch(`https://api.qgenda.com/v2/schedule?startDate=7/5/2024 5:09:34 Pm&endDate=7/5/2024 5:09:34 Pm&includeDeletes=false`, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken.access_token}`,
      }, 
    });

    let parsedReturnData = await returnData.json();

    res.json(parsedReturnData);
  } catch(err) {
    res.send(err);
  }
});

module.exports = router;