const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const routes = require('./routes/Index'); // Import the index routes
const scheduledEvents = require('./scheduled-events');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware for parsing URL-encoded and JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// Serve static React files ALWAYS (dev or prod)
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// Set up API and other routes
app.use(routes); // This will now include the ClientInfo route through index.js

// Fallback route for React Router (MUST come after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// scheduledEvents - This line may be uncommented if scheduled events need to be enabled
// scheduledEvents();

// HTTPS configuration and server start for production
if (PORT == 443) {
  const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, '../anser-2026.crt')),
    key: fs.readFileSync(path.join(__dirname, '../anser-decrypted-2026.key')),
  };

  https.createServer(httpsOptions, app).listen(PORT, function () {
    console.log(`Running in production!`);
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
} else {
  // Start server on defined port
  app.listen(PORT, function () {
    console.log(`🌍 Now listening on localhost:${PORT}`);
  });
}
