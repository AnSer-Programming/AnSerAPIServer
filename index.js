const express = require('express');
const dayjs = require('dayjs');

const PORT = process.env.PORT || 3001;

const app = express();

function converter(sunRiseTimeStamp, timeZoneDiff) {
    const timeConverted = {
        date: dayjs(sunRiseTimeStamp * 1000 - timeZoneDiff).format('M/D/YYYY'),
        time: dayjs(sunRiseTimeStamp * 1000 - timeZoneDiff).format('h:mm:ss')
    };

    return timeConverted;
}

// This is the homepage
app.get('/', (req, res) => {
    res.send("Welcome!");
});

// This leads to the actual API
app.get('/api/:sunRiseTimeStamp/:timeZoneDiff', (req, res) => {
    res.send(converter(req.params.sunRiseTimeStamp, req.params.timeZoneDiff));
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);