const express = require('express');
const dayjs = require('dayjs');
const paramsString = "q=URLUtils.searchParams&topic=api";
const searchParams  = new URLSearchParams(paramsString);

const PORT = process.env.PORT || 3001;

const app = express();

function converter(timeStamp) {
    return dayjs(timeStamp);
}

app.get('/', (req, res) => {
    res.send(`${req.params.TimeStamp}`);
});

app.get('/api/:TimeStamp', (req, res) => {
    res.send(dayjs(req.params.TimeStamp));
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);