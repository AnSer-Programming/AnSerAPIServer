const router = require('express').Router();    
const fs = require('fs')

function scheduler(timeZoneDif, sunRiseUnix, sunSetUnix) {
    fs.writeFile('Output.txt', data, (err) => {
    // In case of a error throw err.
        if(err) {
            res.send(`Error 500 server error ${ err }`);
        } else {

        }
    })
}

router.post('/:account/:dates/:times', (req, res) => {
    //timeConverter(req.params.timeZoneDif, req.params.sunRiseUnix, req.params.sunSetUnix)
    const timeConverter = {
        "timeZoneDif": req.params.timeZoneDif,
        "sunRiseUnix": req.params.sunRiseUnix,
        "sunSetUnix": req.params.sunSetUnix
    };
    res.send(timeConverter);
});

router.get('/:account', (req, res) => {

});

module.exports = router;