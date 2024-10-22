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

// Create a single table and add data to it
// try {
//     const sequelize = require('../config/connection');
//     const VesselListTable = require('../models/VesselListTable');
//     const CurrentVessels = require('./Account6071.json');
//     const seedDatabase = async () => {
//         await VesselListTable.sync({ force: true });   
//         await VesselListTable.bulkCreate(CurrentVessels.dataSet, {
//             returning: true,
//         });
//         process.exit(0);
//     };
    
//     seedDatabase();
// } catch(err) {
//     console.log(`Seed Error: ${ err }`);
// }

// create a single table
try {
    const sequelize = require('../config/connection');
    const TestDatabaseTable = require('../models/CrescentElectricTable');
    const seedDatabase = async () => {
        await TestDatabaseTable.sync({ force: true });  
        process.exit(0);
    };
    
    seedDatabase();
} catch(err) {
    console.log(`Seed Error: ${ err }`);
}