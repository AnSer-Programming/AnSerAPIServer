const router = require('express').Router(); //do not convert to an ES module. It works as is and is fine until you are ready to fully update everything about this API! 
const path = require('path'); //allows for combining relative file path with a set file path
const fsp = require('fs').promises; //this file system call allows for async and await
const fs = require('fs'); //this one is being used for methods and functions that do not allow for async and await
var filePath; //whenever this file is called the filePath will immediately be cleared to avoid errors

async function vesselWrite(accountNum, data) {
    if(accountNum == null) {
        accountNum = 0;
    }
    filePath = `../../vesselJSON/Account${ accountNum }.json`;
    data = JSON.parse(JSON.stringify(data));
    const vesselOwner = arrOfObj => {
      return arrOfObj.map(obj => Object.values(obj));
    }
    
    let sorted = vesselOwner(data.VesselsOwners).sort().reverse();
    let sortedJSON = `{"VesselsOwners": [`
    for(let i = 0; i < sorted.length; i++) {
        if(i === sorted.length-1) {
            sortedJSON += `{"Vessel": "${sorted[i][0]}", "Person": "${sorted[i][1]}"}`;
        } else {
            sortedJSON += `{"Vessel": "${sorted[i][0]}", "Person": "${sorted[i][1]}"},`;
        }
    }
    sortedJSON += `]}`;    
    sortedJSON = JSON.parse(sortedJSON);

    await fsp.writeFile((path.join(__dirname, filePath)), JSON.stringify(sortedJSON), (errFile) => {
        if(errFile) {
            console.error(errFile);
        } else {
            console.log('File has been created');
        }
    });
    data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'}); 
    return data = JSON.parse(data);
}

//Call the function in async to allow for data to be returned before the code moves on.
async function vesselReader(accountNum) {
    if(accountNum == null) {
        accountNum = 0;
    }
    filePath = `../../vesselJSON/Account${ accountNum }.json`;
    // This is a dynamic filePath call that will allow for multiple account numbers to set up a scheduler.
    if(fs.existsSync(path.join(__dirname, filePath))) {
        data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'}); 
        return data = JSON.parse(data);
    } else {
        //Create an empty JSON file
        const data = { "VesselsOwners": [{}]};

        await fsp.writeFile((path.join(__dirname, filePath)), JSON.stringify(data), (errFile) => {
            if(errFile) {
                console.error(errFile);
            } else {
                console.log('File has been created');
            }
        });

        //Make the JSON file readable
        data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'}); 
        return data = JSON.parse(data);
    }
}

//Write to the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.post('/:account', async(req, res) => {
    const data = await vesselWrite(req.params.account, req.body);
    res.json(data);
});

//Read from the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.get('/:account', async(req, res) => {
    const data = await vesselReader(req.params.account);
    res.json(data);
});

module.exports = router;