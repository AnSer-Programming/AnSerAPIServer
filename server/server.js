const express = require('express');
const https =require('https');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');
require('dotenv').config();

const PORT = process.env.PORT || 443;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(routes);

const httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname,'../anser-wildcard-2023.crt')),
  key: fs.readFileSync(path.join(__dirname,'../anser-wildcard-2023-decrypted.key'))
}

https.createServer(httpsOptions, app).listen(PORT, function() {
  console.log(`🌍 Now listening on localhost:${PORT}`);
})