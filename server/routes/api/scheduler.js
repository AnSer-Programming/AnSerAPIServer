const router = require('express').Router();    
const path = require('path');
const fsp = require('fs').promises; //this file system call allows for async and await
const fs = require('fs'); //this one is being used for methods and functions that do not allow for async and await
let filePath;

async function schedulerWrite(accountNum, data) {
    filePath = `../../schedulerJSON/Account${ accountNum }.json`;

    await fsp.writeFile((path.join(__dirname, filePath)), JSON.stringify(data), (errFile) => {
        if(errFile) {
            console.error(errFile);
        } else {
            console.log('File has been created');
        }
    });

    return JSON.stringify(data);
}

async function schedulerAppend(accountNum, data) {
    filePath = `../../schedulerJSON/Account${ accountNum }.json`;
    if(fs.existsSync(path.join(__dirname, filePath))) {
        fs.appendFile((path.join(__dirname, filePath)), JSON.stringify(data), (err) => {
            if(err) {
                res.send(`Error 500 server error ${ err }`);
                console.log(err);
            }
            else {
              // Get the file contents after the append operation
                return data
            }
        });
        return data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'});
    } else {
        console.log(`The file, ${ path.join(__dirname, filePath) }, doesn't exist`);
    }
}

//Call the function in async to allow for data to be returned before the code moves on.
async function schedulerReader(accountNum) {
    const filePath = `../../schedulerJSON/Account${ accountNum }.json`;
    // This is a dynamic filePath call that will allow for multiple account numbers to set up a scheduler.
    if(fs.existsSync(path.join(__dirname, filePath))) {
        console.log(`The file ${ path.join(__dirname, filePath) } exists`);
        return data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'});
    } else {
        //Create an empty JSON file
        const data = {

        };

        await fsp.writeFile((path.join(__dirname, filePath)), JSON.stringify(data), (errFile) => {
            if(errFile) {
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
router.post('/:account', async(req, res) => {
    const data = await schedulerWrite(req.params.account, req.body);
    res.send(JSON.parse(data));
});

//Update the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.put('/:account', async(req, res) => {
    const data = await schedulerAppend(req.params.account, req.body);
    res.send(JSON.parse(data));
});

//Read from the accounts JSON file
//  Use async and await to force the code to wait for results rather than letting it continue reading lines.
router.get('/:account', async(req, res) => {
    const data = await schedulerReader(req.params.account);
    res.send(JSON.parse(data));
});

module.exports = router;