const router = require('express').Router();
const unixEpoch = Math.floor(Date.now() / 1000);
const dotenv = require("dotenv");
var sha256 = require('js-sha256');

dotenv.config();

router.get('/', async (req, res) => {
  let returnData;
  let decoded = Buffer.from(`${process.env.BASEMENT_REPAIR_SPECIALISTS_SECRET}`, 'base64').toString('ascii');
  let hash = await sha256.hmac(decoded, `${process.env.COMPANY_ID}.${process.env.BASEMENT_REPAIR_SPECIALISTS_API_KEY}.${unixEpoch}`);
  let encoded = Buffer.from(hash).toString('base64');
  console.log(hash);

  console.log(`${process.env.COMPANY_ID}:${process.env.BASEMENT_REPAIR_SPECIALISTS_API_KEY}:${unixEpoch}:${encoded}`);
  try {  
    returnData = await fetch(`https://api4.marketsharpm.com/WcfDataService.svc/Leads`, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
        'Authorization': `${process.env.COMPANY_ID}:${process.env.BASEMENT_REPAIR_SPECIALISTS_API_KEY}:${unixEpoch}:${encoded}`, 
      }, 
    });

    console.log(returnData);

    let parsedReturnData = await returnData.json();

    res.json(parsedReturnData);
  } catch(err) {
    res.send(err);
  }
});

module.exports = router;