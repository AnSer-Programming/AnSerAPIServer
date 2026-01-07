const router = require('express').Router(); //do not convert to an ES module. It works as is and is fine until you are ready to fully update everything about this API! 
const path = require('path'); //allows for combining relative file path with a set file path
const fsp = require('fs').promises; //this file system call allows for async and await
const fs = require('fs'); //this one is being used for methods and functions that do not allow for async and await
// const dayjs = require('dayjs'); //allows for easy date manipulation and date math
// const customParseFormat = require('dayjs/plugin/customParseFormat'); //allows for time manipulation
// dayjs.extend(customParseFormat); //brings in the time manipulation extension into the main dayjs function call
var filePath; //whenever this file is called the filePath will immediately be cleared to avoid errors

async function pastDateChecker(accountNum) {
  const data = await schedulerReader(accountNum);
  let dataParsed = JSON.parse(data);
  let dataString = JSON.stringify(data);
  let dates = [];
  //console.log(Object.values(dataParsed.Available.Dates));
  //dataParsed.Available.Dates.Date.values();

  console.log(Object.values(dataParsed.Available.Dates));
  //console.log(dates);
  let newData = {
    "Available": { "Dates": [] },
  }

  //console.log(data);

  if (data != null) {
    for (let i = 0; i < Object.keys(dataParsed.Available.Dates).length; i++) {
      // console.log(Object.values(dataParsed.Available.Dates[i]));
      // if(dayjs() > Object.values(dataParsed.Available.Dates[i])) {
      // }
    }
  }
}

async function schedulerWrite(accountNum, data) {
  // pastDateChecker(accountNum);
  filePath = `../../schedulerJSON/Account${accountNum}.json`;

  await fsp.writeFile((path.join(__dirname, filePath)), JSON.stringify(data), (errFile) => {
    if (errFile) {
      console.error(errFile);
    } else {
      console.log('File has been created');
    }
  });
  return data = await fsp.readFile(path.join(__dirname, filePath), { encoding: 'utf8' });
}

async function schedulerAppend(accountNum, data) {
  // pastDateChecker(accountNum);
  filePath = `../../schedulerJSON/Account${accountNum}.json`;
  time = data.Time.substr(0, data.Time.length - 2); // everything that is in the string before the last two characters will be stored in the time variable
  meridiem = data.Time.substr(data.Time.length - 2); // remove the meridiem from the time string
  timeLastChar = time.substr(time.length - 1);
  if (timeLastChar != " ") {
    data.Time = `${time} ${meridiem}`; // concatinating the time and meridiem with a space between to keep it dynamic
  }

  // if (data.Set) {
  //   console.log(`Move ${data.Date} and ${dayjs(data.Time, ['h:mm A', 'h A', 'hA', 'h:mmA', 'h:mm a', 'h a', 'ha', 'h:mma']).format("HH:mm")} from Available to Unavailable`);
  // }
  // current = await schedulerReader(accountNum);
  // if(data.set) {
  //     // for(let i = 0; i < current.date.length(); i++) {

  //     // }
  // } else {

  // }
  // if(fs.existsSync(path.join(__dirname, filePath))) {
  //     // fs.appendFile((path.join(__dirname, filePath)), JSON.stringify(data), (err) => {
  //     //     if(err) {
  //     //         res.send(`Error 500 server error ${ err }`);
  //     //         console.log(err);
  //     //     }
  //     //     else {
  //     //       // Get the file contents after the append operation
  //     //         return data
  //     //     }
  //     // });
  //     // return data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'});
  // // } else {
  // //     console.log(`The file, ${ path.join(__dirname, filePath) }, doesn't exist`);
  // // }
  return data = await fsp.readFile(path.join(__dirname, filePath), { encoding: 'utf8' });
}

//Call the function in async to allow for data to be returned before the code moves on.
async function schedulerReader(accountNum) {
  filePath = `../../schedulerJSON/Account${accountNum}.json`;
  // This is a dynamic filePath call that will allow for multiple account numbers to set up a scheduler.
  if (fs.existsSync(path.join(__dirname, filePath))) {
    return data = await fsp.readFile(path.join(__dirname, filePath), { encoding: 'utf8' });
  } else {
    //Create an empty JSON file
    const data = {

    };

    await fsp.writeFile((path.join(__dirname, filePath)), JSON.stringify(data), (errFile) => {
      if (errFile) {
        console.error(errFile);
      } else {
        console.log('File has been created');
      }
    });

    //Make the JSON file readable
    return JSON.stringify(data);
  }
}

//Write to the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.post('/:account', async (req, res) => {
  const data = await schedulerWrite(req.params.account, req.body);
  res.send(JSON.parse(data));
});

//Update the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.put('/:account', async (req, res) => {
  const data = await schedulerAppend(req.params.account, req.body);
  res.send(JSON.parse(data));
});

//Read from the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.get('/:account', async (req, res) => {
  // pastDateChecker(req.params.account);
  const data = await schedulerReader(req.params.account);
  res.send(JSON.parse(data));
});

module.exports = router;