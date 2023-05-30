const router = require('express').Router();

function timeConverter(timeZoneDif, sunRiseUnix, sunSetUnix) {
    return router.send("This is the time converter");
}

router.get('/:timeZoneDif/:sunRiseUnix/:sunSetUnix', (req, res) => {
    //timeConverter(req.params.timeZoneDif, req.params.sunRiseUnix, req.params.sunSetUnix)
    const timeConverter = {
        "timeZoneDif": req.params.timeZoneDif,
        "sunRiseUnix": req.params.sunRiseUnix,
        "sunSetUnix": req.params.sunSetUnix
    };
    res.send(timeConverter);
});

module.exports = router;