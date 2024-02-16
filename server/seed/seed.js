// try {
//     const sequelize = require('../config/connection');
//     const VesselListTable = require('../models/VesselListTable');
//     const CurrentVessels = require('./Account6071.json');
//     const seedDatabase = async () => {
//         await sequelize.sync({ force: true });   
//                 await VesselListTable.bulkCreate(CurrentVessels.dataSet, {
//                     returning: true,
//                 }); 
//         process.exit(0);
//     };
    
//     seedDatabase();
// } catch(err) {
//     console.log(`Seed Error: ${ err }`);
// }

// try {
//     const sequelize = require('../config/connection');
//     const VesselListTable = require('../models/VesselListTable');
//     const CurrentVessels = require('./Account6071.json');
//     const seedDatabase = async () => {
//         await sequelize.sync({ force: true });   
//         await VesselListTable.bulkCreate(CurrentVessels.dataSet, {
//             returning: true,
//         });
//         process.exit(0);
//     };
    
//     seedDatabase();
// } catch(err) {
//     console.log(`Seed Error: ${ err }`);
// }