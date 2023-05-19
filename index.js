const express = require('express');
const dayjs = require('dayjs');
const timeStamp = window.location.searchParams.get("timeStamp");

const PORT = process.env.PORT || 3001;

const app = express();

function converter(timeStamp) {
    return dayjs(timeStamp);
}

app.get('/api', (req, res) => {
    res.json({timeStamp});
})
    
app.post('/api', (req, res) => {
    res.json({timeDate: converter()});
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);