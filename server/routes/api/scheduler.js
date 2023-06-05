const router = require('express').Router();    
const fs = require('fs');
let filePath;

function schedulerWrite(accountNum, data) {
    filePath = `../../schedulerJSON/Account${ accountNum }.json`;
    fs.writeFile(filePath, data, (err) => {
    // In case of an error throw err.
        if(err) {
            res.send(`Error 500 server error ${ err }`);
            console.log(err);
        }
    });
}

function schedulerAppend(accountNum, data) {
    filePath = `../../../schedulerJSON/Account${ accountNum }.json`;
    fs.appendFile(`../schedulerJSON/${ accountNum }.json`, data, (err) => {
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

function schedulerReader(accountNum) {
    filePath = `../../schedulerJSON/Account${ accountNum }.json`;
    try {
        if(fs.existsSync(filePath)) {
            console.log("The file exists");
            fs.readFile(filePath, data, (err) => {
                // In case of an error throw err.
                if(err) {
                    res.send(`Error 500 server error ${ err }`);
                    console.log(err);
                }
            });
        } else {
            console.log(`The file, ${ filePath }, doesn't exist`);
        }
    } catch(err) {
        console.log(`There was a server error`);
        console.log(err);
    }
}

router.post('/:account', (req, res) => {
    schedulerWrite(req.params.account, req.body);
    res.send(timeConverter);
});

router.put('/:account', (req, res) => {
    res.send(schedulerAppend(req.params.account, req.body));
});

router.get('/:account', (req, res) => {
    res.send(schedulerReader(req.params.account));
});

module.exports = router;