const express = require('express');
const pem = require('pem');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');

const PORT = process.env.PORT || 8443;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(routes);

const pfx = fs.readFileSync(path.join(__dirname, '../anser-wildcard-2023.pfx'));
pem.readPkcs12(pfx, { p12Password: process.env.SSL_PASSWORD }, (err, cert) => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
});