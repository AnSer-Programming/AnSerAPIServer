const router = require('express').Router();

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
const crescentElectricReachRoute = require('./CrescentElectricReachList');
const disconnectListRoute = require('./DisconnectList');
const residentDirectoryRoute = require('./ResidentDirectory');
const schedulerRoute = require('./Scheduler');
const timeConverterRoute = require('./TimeConverter');
const vesselRouteDB = require('./VesselListDB');
const clientInfoRoute = require('./ClientInfoRouter'); // Import ClientInfoRouter

// Set Routes
router.use('/CrescentElectricReachList', crescentElectricReachRoute);
router.use('/DisconnectList', disconnectListRoute);
router.use('/ResidentDirectory', residentDirectoryRoute);
router.use('/Scheduler', schedulerRoute);
router.use('/timeConverter', timeConverterRoute);
router.use('/VesselDB', vesselRouteDB);
router.use('/ClientInfo', clientInfoRoute); // Set ClientInfo route

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
const providersRoute = require('./GetData/GetProviders');
const clientsContactsAndRolesRoute = require('./GetData/GetClientContactsAndRoles');
const getUndelivered = require('./GetData/Reports/GetUndelivered');
const qGenda = require('./GetData/QGendaData/QGenda');
const basementRepairSpecialists = require('./BasementRepairSpecialists');
const getISHolidays = require('./GetData/GetISHolidays');

// Set Routes
router.use('/GetDID', getDIDRoute);
router.use('/Clients', clientRoutes);
router.use('/ClientsAndDirectories', clientsAndDirectoriesRoute);
router.use('/ContactsAndDirectories', contactsDirectoriesRoutes);
router.use('/DirectoryContactsAndInfoCards', directoryContactsAndInfoCards);
router.use('/InfoPages', infoPages);
router.use('/AgentInfo', agentInfo);
router.use('/AgentSupervisor', agentSupervisor);
router.use('/GetProviders', providersRoute);
router.use('/GetClientContactsAndRoles', clientsContactsAndRolesRoute);
router.use('/GetUndelivered', getUndelivered);
router.use('/QGenda', qGenda);
router.use('/BasementRepairSpecialists', basementRepairSpecialists);
router.use('/ISHolidays', getISHolidays);

// Call Monitoring API
// Declare Variables
const callInfo = require('./Speech-To-Text-API/CallInfo');
const callList = require('./Speech-To-Text-API/CallList');

// Set Routes
router.use('/CallInfo', callInfo);
router.use('/CallList', callList);

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

// MailGun Tools
const getEvents = require('./MailGun/GetEvents');

router.use('/MailGun/Events', getEvents);

// NodeMailer Tools
const sendFeedbackEmail = require('./ReportIssueFeedback');

router.use('/ReportIssueFeedback', sendFeedbackEmail);


module.exports = router;
