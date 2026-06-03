const dotenv = require("dotenv");

dotenv.config();

async function main() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let m = today.getMonth() + 1; // Months start at 0!
  let d = today.getDate();

  const formattedToday = m + '/' + d + '/' + yyyy;
  let returnData;
  let token;
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
    console.log(bearerToken);

    returnData = await fetch(`https://api.qgenda.com/v2/staffmember?includes=String`, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken.access_token}`,
      },
    });

    let parsedReturnData = await returnData.json();

    return parsedReturnData;
  } catch (err) {
    return (err);
  }
}

module.exports = main();