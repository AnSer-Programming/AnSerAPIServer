const express = require('express');
const dayjs = require('dayjs');
const url_string = window.location;
const url = new URL(url_string);
const timeStamp = url.searchParams.get("timeStamp");

const PORT = process.env.PORT || 80;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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