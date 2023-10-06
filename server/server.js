const express = require('express');
const https =require('https');
const fs = require('fs');
const path = require('path');
const routes = require('./routes/Index');
const scheduledEvents = require('./scheduled-events');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ limit:'50mb', extended: true }));
app.use(express.json({ limit:'50mb' }));

if(process.env.PRODUCTION === 'True') {
  app.use(express.static(path.join(__dirname, '../client/build')));
} 

// scheduledEvents;
app.use(routes);

if(PORT==443) {
  const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname,'../anser-wildcard-2023.crt')),
    key: fs.readFileSync(path.join(__dirname,'../anser-wildcard-2023-decrypted.key'))
  }
  
  https.createServer(httpsOptions, app).listen(PORT, function() {
    console.log(`Running in production!`);
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
} else {
  app.listen(PORT, function() {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
}