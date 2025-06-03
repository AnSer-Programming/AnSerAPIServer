const router = require('express').Router();
const dotenv = require("dotenv");

dotenv.config();

router.get('/', async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let m = today.getMonth() + 1; // Months start at 0!
  let d = today.getDate();

  const formattedToday = m + '/' + d + '/' + yyyy;
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

    returnData = await fetch(`https://api.qgenda.com/v2/schedule?startDate=${formattedToday}&endDate=${formattedToday}&includeDeletes=false`, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken.access_token}`,
      },
    });

    let parsedReturnData = await returnData.json();

    res.json(parsedReturnData);
  } catch (err) {
    res.send(err);
  }
});

router.post('/GetOnCall', async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let m = today.getMonth() + 1; // Months start at 0!
  let d = today.getDate();

  const formattedToday = m + '/' + d + '/' + yyyy;
  let params = req.body;

  if (params.Time.split(" ")[1] == 'AM') {
    if (params.Time.split(":")[0] == '12') {
      params.Time = params.Time.split(" ")[0];
      params.Time = `00:${params.Time.split(":", 3)[1]}:${params.Time.split(":", 3)[2]}`;
    } else {
      params.Time = params.Time.split(" ")[0];
    }
  } else {
    if (params.Time.split(":")[0] == '12') {
      params.Time = params.Time.split(" ")[0];
    } else {
      params.Time = params.Time.split(" ")[0];
      params.Time = `${parseInt(params.Time.split(":", 3)[0]) + 12}:${params.Time.split(":", 3)[1]}:${params.Time.split(":", 3)[2]}`;
    }
  }

  let placeHolder = params.Date;

  params.Date = `${params.Date.split("/")[2]}-`;
  if (placeHolder.split("/")[0].length < 2) {
    params.Date += `0${placeHolder.split("/")[0]}-`;
  } else {
    params.Date += `${placeHolder.split("/")[0]}-`;
  }
  if (placeHolder.split("/")[1].length < 2) {
    params.Date += `0${placeHolder.split("/")[1]}`;
  } else {
    params.Date += `${placeHolder.split("/")[1]}`;
  }

  let returnData = "Test";
  let token = "Test";
  let onCall = "API Error";
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

    returnData = await fetch(`https://api.qgenda.com/v2/schedule?startDate=${params.Date}&endDate=${params.Date}&includeDeletes=false`, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken.access_token}`,
      },
    });

    let parsedReturnData = await returnData.json();

    for (let i = 0; i < parsedReturnData.length; i++) {
      if (!parsedReturnData[i].isStruck) {
        if (parsedReturnData[i].TaskKey == params.TaskKey) {
          if (parsedReturnData[i].StartDate.split("T")[0] <= params.Date && parsedReturnData[i].StartTime <= params.Time) {
            if (parsedReturnData[i].EndDate.split("T")[0] > params.Date || parsedReturnData[i].EndDate.split("T")[0] == params.Date && parsedReturnData[i].EndTime > params.Time || parsedReturnData[i].EndDate.split("T")[0] > params.Date && parsedReturnData[i].EndTime == '00:00:00') {
              onCall = await `${parsedReturnData[i].StaffFName} ${parsedReturnData[i].StaffLName}`;
            }
          }
        }
      }
    }

    res.json(onCall);
  } catch (err) {
    res.send(err);
  }
});

router.get('/GetStaffList', async (req, res) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let m = today.getMonth() + 1; // Months start at 0!
  let d = today.getDate();

  const formattedToday = m + '/' + d + '/' + yyyy;
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

    returnData = await fetch(`https://api.qgenda.com/v2/staffmember?includes=String`, {
      headers: {
        method: 'GET',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken.access_token}`,
      },
    });

    let parsedReturnData = await returnData.json();

    res.json(parsedReturnData);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;