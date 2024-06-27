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
const vesselRouteDB = require('./VesselListDB');

// Set Routes
router.use('/DisconnectList', disconnectListRoute);
router.use('/ResidentDirectory', residentDirectoryRoute);
router.use('/Scheduler', schedulerRoute);
router.use('/timeConverter', timeConverterRoute);
router.use('/VesselDB', vesselRouteDB);

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
const agentSupervisor = require('./GetData/GetAgentsSupervisors');
const getUndelivered = require('./GetData/GetUndelivered');

// Set Routes
router.use('/GetDID', getDIDRoute);
router.use('/Clients', clientRoutes);
router.use('/ClientsAndDirectories', clientsAndDirectoriesRoute);
router.use('/ContactsAndDirectories', contactsDirectoriesRoutes);
router.use('/DirectoryContactsAndInfoCards', directoryContactsAndInfoCards);
router.use('/InfoPages', infoPages);
router.use('/AgentInfo', agentInfo);
router.use('/AgentSupervisor', agentSupervisor);
router.use('/GetUndelivered', getUndelivered);

// Call monitoring API
// Declare Variables
const callInfo = require('./Speech-To-Text-API/CallInfo');
const callList = require('./Speech-To-Text-API/CallList');

// Set Routes
router.use('/CallInfo', callInfo);
router.use('/CallList', callList);

module.exports = router;

// Training Tools
// Declare Variables
const indexRandomizer = require('./Training/IndexRandomizer');
const apiGetPutPost = require('./Training/APIGetPutPostTraining');

// Set Routes
router.use('/IndexRandomizer', indexRandomizer);
router.use('/apiConnectionTest', apiGetPutPost);

// Secret
const yearToDateAccount = require('./Secret/YearToDateAccounts');

router.use('/Secret/YearToDate/Accounts', yearToDateAccount);

module.exports = router;