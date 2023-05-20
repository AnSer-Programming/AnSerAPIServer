const express = require('express');
const dayjs = require('dayjs');
const paramsString = "q=URLUtils.searchParams&topic=api";
const searchParams  = new URLSearchParams(paramsString);

const PORT = process.env.PORT || 3001;

const app = express();

function converter(timeStamp) {
    const timeConverted = {
        date: dayjs(timeStamp * 1000, 'M/D/YYYY'),
        time: dayjs(timeStamp * 1000, 'H:m:s')
    }
    return timeConverted;
}

app.get('/', (req, res) => {
    res.send("Welcome!");
});

app.get('/api/:TimeStamp', (req, res) => {
    res.send(converter(req.params.TimeStamp));
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);