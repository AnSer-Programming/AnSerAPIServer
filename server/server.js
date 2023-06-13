const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');


const options = {
  pfx: fs.readFileSync('../../ssl/anser-wildcard-2023.pfx'),
  passphrase: process.env.SSL_PASSWORD
};

const PORT = process.env.PORT || 80;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(routes);

https.createServer(options, (req, res) => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});