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
const residentDirectoryRoute = require('./ResidentDirectory');
const schedulerRoute = require('./Scheduler');
const timeConverterRoute = require('./TimeConverter');
const vesselRoute = require('./Vessel');

// Set Routes
router.use('/DisconnectList', disconnectListRoute);
router.use('/ResidentDirectory', residentDirectoryRoute);
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
const getDIDRoute = require('./GetData/GetDID');
const clientRoutes = require('./GetData/GetClients');
const clientsAndDirectoriesRoute = require('./GetData/GetClientsDirectories');
const contactsDirectoriesRoutes = require('./GetData/GetContactsDirectories');
const directoryContactsAndInfoCards = require('./GetData/GetDirectoryContactsAndInfoCards');
const infoPages = require('./GetData/GetInfoPages');
const agentInfo = require('./GetData/GetAgents');

// Set Routes
router.use('/GetDID', getDIDRoute);
router.use('/Clients', clientRoutes);
router.use('/ClientsAndDirectories', clientsAndDirectoriesRoute);
router.use('/ContactsAndDirectories', contactsDirectoriesRoutes);
router.use('/DirectoryContactsAndInfoCards', directoryContactsAndInfoCards);
router.use('/InfoPages', infoPages);
router.use('/AgentInfo', agentInfo);

module.exports = router;