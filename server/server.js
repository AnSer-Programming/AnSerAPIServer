const express = require('express');
const path = require('path');
const routes = require('./routes');

const PORT = process.env.PORT || 80;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));
app.use(routes);

app.listen(PORT, () => {
  console.log(`🌍 Now listening on localhost:${PORT}`);
});