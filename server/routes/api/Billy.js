const router = require('express').Router();
const var1 = "Hello, World";

function timeConverter(timeZoneDif, sunRiseUnix, sunSetUnix) {
    return router.send("This is Billy's playground");
}

router.get('/', (req, res) => {
    //timeConverter(req.params.timeZoneDif, req.params.sunRiseUnix, req.params.sunSetUnix)
    
    res.send("Billy!");
});

module.exports = router;
