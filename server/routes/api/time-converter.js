const router = require('express').Router();

function timeConverter(body) {
    return router.send("This is the time converter");
}

router.get('/', async(req, res) => {
    //timeConverter(req.params.timeZoneDif, req.params.sunRiseUnix, req.params.sunSetUnix)
    const timeConverter = await timeConverter(req.body);
    res.send(timeConverter);
});

module.exports = router;
