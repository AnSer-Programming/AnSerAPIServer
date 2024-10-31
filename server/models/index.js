const CalendarTable = require('./CalendarTable');
const ContactDispatchTable = require('./ContactDispatchTable');
const CrescentElectricTable = require('./CrescentElectricTable');
const DIDTable = require('./DIDTable');
const OnTimeTable = require('./OnTimeTable');
const TestDatabaseTable = require('./TestDatabaseTable');
const VesselListTable = require('./VesselListTable');
const ClientInfoTable = require('./ClientInfoTable'); // New import

module.exports = { 
  OnTimeTable, 
  ContactDispatchTable, 
  CalendarTable, 
  CrescentElectricTable, 
  DIDTable, 
  VesselListTable, 
  TestDatabaseTable,
  ClientInfoTable // New export
};
