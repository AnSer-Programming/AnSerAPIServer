const router = require('express').Router();

// Route for John Fallahee/Ryan Nettesheim || Training
// Declare variables
const brainier = require('./Brainier/Index');
const onTimeRoute = require('./OnTime');

// Set Routes
router.use('/Brainier', brainier);
router.use('/OnTime', onTimeRoute);

// Test Routes
// Declare variables
const billy = require('./Billy');

// Set Routes
router.use('/Billy', billy);

// Internal Documentation Routes
// Declare variables
const contactDispatch = require('./ContactDispatch');

// Set Routes
router.use('/ContactDispatch', contactDispatch);

// API Routes
// Declare variables
const disconnectListRoute = require('./DisconnectList');
const schedulerRoute = require('./Scheduler');
const timeConverterRoute = require('./TimeConverter');
const vesselRoute = require('./Vessel');

// Set Routes
router.use('/DisconnectList', disconnectListRoute);
router.use('/Scheduler', schedulerRoute);
router.use('/timeConverter', timeConverterRoute);
router.use('/Vessel', vesselRoute);

// Data Tracker Routes
// Declare Variables
const agentLogRoute = require('./Tracker/ActiveAgentLog');
const completedCallsRoute = require('./Tracker/CallsCompleted');

// Set Routes
router.use('/ActiveAgentLog', agentLogRoute);
router.use('/CompletedCalls', completedCallsRoute);

// Get Data Routes
// Declare Variables
const clientsAndDirectoriesRoute = require('./GetData/GetClientsDirectories');
const clientRoutes = require('./GetData/GetClients');

// Set Routes
router.use('/clients', clientRoutes);
router.use('/clientsAndDirectories', clientsAndDirectoriesRoute);

module.exports = router;