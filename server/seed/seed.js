try {
    const sequelize = require('../config/connection');
    const { DIDTable } = require('../models');
    const PhoneNumbers = require('./PhoneNumbers.json');
    const seedDatabase = async () => {
        await sequelize.sync({ force: true });   
        await DIDTable.bulkCreate(PhoneNumbers.dataSet, {
            returning: true,
        });
        process.exit(0);
    };
    
    seedDatabase();
} catch(err) {
    console.log(`Seed Error: ${ err }`);
}