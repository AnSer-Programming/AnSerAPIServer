try {
    const sequelize = require('../config/connection');
    const ResidentDirectoryTable = require('../models/ResidentDirectoryTable');
    // const Account = require('./Accounts.json');
    const seedDatabase = async () => {
        await sequelize.sync({ force: true });   
        process.exit(0);
    };
    
    seedDatabase();
} catch(err) {
    console.log(`Seed Error: ${ err }`);
}

// try {
//     const sequelize = require('../config/connection');
//     const { DIDTable } = require('../models');
//     const PhoneNumbers = require('./PhoneNumbers.json');
//     const seedDatabase = async () => {
//         await sequelize.sync({ force: true });   
//         await DIDTable.bulkCreate(PhoneNumbers.dataSet, {
//             returning: true,
//         });
//         process.exit(0);
//     };
    
//     seedDatabase();
// } catch(err) {
//     console.log(`Seed Error: ${ err }`);
// }