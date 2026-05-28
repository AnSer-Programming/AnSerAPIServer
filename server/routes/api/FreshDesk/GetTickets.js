const router = require('express').Router();
const dotenv = require("dotenv");
'anser.freshdesk.com';
dotenv.config();

async function listAgents() {
  // const response = await fetch(`https://anser.freshdesk.com/api/v2/search/tickets?query="(agent_id:151022410134) AND (created_at:>'2026-03-28')"`, {
  const response = await fetch(`https://anser.freshdesk.com/api/v2/tickets?per_page=100&updated_since=2026-04-28`, {
    headers: {
      method: 'GET',
      'Content-Type': 'application/json',
      'Authorization': Buffer.from(`${process.env.FD_API_KEY}:X`).toString('base64')
    }
  });

  if (!response.ok) {
    console.log(response);
    return;
  }

  const agents = await response.json();

  return agents;
}

router.get('/', async (req, res) => {
  try {
    let agentList = listAgents();
    res.json(await agentList);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;