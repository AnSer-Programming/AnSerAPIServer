const router = require('express').Router();
const var1 = "Hello, World";

function timeConverter(timeZoneDif, sunRiseUnix, sunSetUnix) {
    return router.send("This is Billy's playground");
}

router.get('/:Billy', (req, res) => {
    //timeConverter(req.params.timeZoneDif, req.params.sunRiseUnix, req.params.sunSetUnix)
    
    res.send(timeConverter);
});

module.exports = router;