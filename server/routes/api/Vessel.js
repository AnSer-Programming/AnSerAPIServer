const router = require('express').Router(); //do not convert to an ES module. It works as is and is fine until you are ready to fully update everything about this API! 
const path = require('path'); //allows for combining relative file path with a set file path
const fsp = require('fs').promises; //this file system call allows for async and await
const fs = require('fs'); //this one is being used for methods and functions that do not allow for async and await
var filePath; //whenever this file is called the filePath will immediately be cleared to avoid errors

async function vesselWrite(accountNum, data) {
    let placeHolder;
    if(accountNum == null) {
        accountNum = 0;
    }
    filePath = `../../vesselJSON/Account${ accountNum }.json`;
    data.VesselsOwners = data.VesselsOwners.sort(((a, b) =>  a.Vessel.localeCompare(b.Vessel)));
    
    if(accountNum == 38 || accountNum == 6071) {
        for(var i = 0; i < data.VesselsOwners.length; i++) {
            if(data.VesselsOwners[i].Vessel == "Unlisted") {
                if(data.VesselsOwners[i].Person != "Misc") {
                    data.VesselsOwners[i].Person = "Misc";
                }
                if(i < data.VesselsOwners.length) {
                    placeHolder = data.VesselsOwners[i];
                    data.VesselsOwners.splice(i, 1);
                    data.VesselsOwners[data.VesselsOwners.length] = placeHolder;
                }
                break;
            } else {
                if(data.VesselsOwners.length-1 == i) {
                    data.VesselsOwners[i+1] = {Vessel: "Unlisted", Person: "Misc"};
                }
            }
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
async function vesselReader(accountNum) {
    if(accountNum == null) {
        accountNum = 0;
    }
    filePath = `../../vesselJSON/Account${ accountNum }.json`;
    // This is a dynamic filePath call that will allow for multiple account numbers to set up a scheduler.
    if(fs.existsSync(path.join(__dirname, filePath))) {
        let data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'}); 
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