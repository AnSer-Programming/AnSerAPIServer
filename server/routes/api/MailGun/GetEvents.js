const Mailgun = require('mailgun.js');
const router = require('express').Router();
const dotenv = require("dotenv");
// const fetch = require('node-fetch');

dotenv.config();

router.get('/', async (req, res) => {
  // const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});
  
      // `https://api.mailgun.net/v4/domains`,
  const send = {data: "Success"};
  let resp;
  async function run() {
    const domainName = 'msg.anser.com';
    resp = await fetch(`https://api.mailgun.net/v3/${domainName}/events?event=failed&limit=300`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`api:`+process.env.MAILGUN_API_KEY).toString('base64')
        }
      }
    );
  
    const data = await resp.text();
    res.json(JSON.parse(data));
  }
  
  run();

});

module.exports = router;