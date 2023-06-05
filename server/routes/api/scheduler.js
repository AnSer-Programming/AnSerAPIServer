const router = require('express').Router();    
const path = require('path');
const fsp = require('fs').promises; //this file system call allows for async and await
const fs = require('fs'); //this one is being used for methods and functions that do not allow for async and await
let filePath;

function schedulerWrite(accountNum, data) {
    filePath = __dirname, `../../schedulerJSON/Account${ accountNum }.json`;
    fs.writeFile(filePath, data, (err) => {
    // In case of an error throw err.
        if(err) {
            res.send(`Error 500 server error ${ err }`);
            console.log(err);
        }
    });
}

function schedulerAppend(accountNum, data) {
    filePath = `../../schedulerJSON/Account${ accountNum }.json`;
    fs.appendFile((__dirname, `../schedulerJSON/${ accountNum }.json`), data, (err) => {
        if (err) {
            res.send(`Error 500 server error ${ err }`);
            console.log(err);
        }
        else {
          // Get the file contents after the append operation
            console.log("\nFile Contents of file after append:",
            fs.readFileSync("example_file.txt", "utf8"));
        }
    });

}

//Call the function in async to allow for data to be returned before the code moves on.
async function schedulerReader(accountNum) {
    const filePath = `../../schedulerJSON/Account${ accountNum }.json`;
    // This is a dynamic filePath call that will allow for multiple account numbers to set up a scheduler.
    if(fs.existsSync(path.join(__dirname, filePath))) {
        console.log(`The file ${ path.join(__dirname, filePath) } exists`);
        return data = await fsp.readFile(path.join(__dirname, filePath), {encoding: 'utf8'});
    } else {
        console.log(`The file, ${ path.join(__dirname, filePath) }, doesn't exist`);
    }
}

router.post('/:account', (req, res) => {
    const filePath = `../../scheduler.json/Account${ req.params.account }.json`;
    writeToFile(path.join(__dirname, filePath), JSON.stringify(req.data)).then((data) => res.json(data));
});

router.put('/:account', (req, res) => {
    const filePath = `../../scheduler.json/Account${ req.params.account }.json`;
    readAndAppend(path.join(__dirname, filePath), req.data).then((data) => res.json(JSON.parse(data)));
});

router.get('/:account', async(req, res) => {
    const data = await schedulerReader(req.params.account);
    console.log(data);
    res.send(JSON.parse(JSON.stringify(data)));
});

module.exports = router;