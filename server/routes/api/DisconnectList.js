const router = require('express').Router(); //do not convert to an ES module. It works as is and is fine until you are ready to fully update everything about this API! 
const path = require('path'); //allows for combining relative file path with a set file path
const fsp = require('fs').promises; //this file system call allows for async and await
const fs = require('fs'); //this one is being used for methods and functions that do not allow for async and await
var filePath; //whenever this file is called the filePath will immediately be cleared to avoid errors

async function disconnectWrite(accountNum, data) {
    let placeHolder;
    if(accountNum == null) {
        accountNum = 0;
    }
    filePath = `../../disconnectJSON/Account${ accountNum }.json`;
    data.DisconnectList = data.DisconnectList.sort();
    
    // Force the unlisted row for the accounts declared in the if statement
    if(accountNum == 38 || accountNum == 6509) {
        for(var i = 0; i < data.DisconnectList.length; i++) {
            if(data.DisconnectList[i].PropertyOwner == "Unlisted") {
                if(data.DisconnectList[i].Notes != "Unlisted") {
                    data.DisconnectList[i].Notes = "Unlisted";
                }
                if(data.DisconnectList[i].Street != "Unlisted") {
                    data.DisconnectList[i].Street = "Unlisted";
                }
                if(i < data.DisconnectList.length) {
                    placeHolder = data.DisconnectList[i];
                    data.DisconnectList.splice(i, 1);
                    data.DisconnectList[data.DisconnectList.length] = placeHolder;
                }
                break;
            } else {
                if(data.DisconnectList.length-1 == i) {
                    data.DisconnectList[i+1] = {PropertyOwner: "Unlisted", Street: "Unlisted", Notes: "Unlisted"};
                }
            }
        }
    }

    // Set the index column for each row
    if(typeof(data.DisconnectList) != undefined) {
        for(let i = 0; i < data.DisconnectList.length; i++) {
            data.DisconnectList[i].index = i;
        }
    }

    await fsp.writeFile((path.join(__dirname, filePath)), JSON.stringify(data), (errFile) => {
        if(errFile) {
            console.error(`Write Error ${errFile}`);
        } else {
            console.log('File has been created');
        }
    });
    data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'});
    return data = JSON.parse(data); 
}

//Call the function in async to allow for data to be returned before the code moves on.
async function disconnectReader(accountNum) {
    if(accountNum == null) {
        accountNum = 0;
    }
    filePath = `../../disconnectJSON/Account${ accountNum }.json`;
    // This is a dynamic filePath call that will allow for multiple account numbers to set up a scheduler.
    if(fs.existsSync(path.join(__dirname, filePath))) {
        let data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'}); 
        return data = JSON.parse(data);
    } else {
        //Create an empty JSON file
        let data = { "DisconnectList": [{"PropertyOwner": "Unlisted", "Street": "Unlisted", "City": "", "State": "", "Zip": "", "Amount": "", "Notes": "Unlisted"}]};

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
    const data = await disconnectWrite(req.params.account, req.body);
    res.json(data);
});

//Read from the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.get('/:account', async(req, res) => {
    const data = await disconnectReader(req.params.account);
    res.json(data);
});

module.exports = router;