try {
    const sequelize = require('../config/connection');
    const { ContactDispatchTable } = require('../models');
    const Accounts = require('./Accounts.json');
    const seedDatabase = async () => {
        await sequelize.sync({ force: true });   
        await ContactDispatchTable.bulkCreate(Accounts.Accounts, {
            returning: true,
        });
        process.exit(0);
    };
    
    seedDatabase();
} catch(err) {
    console.log(`Seed Error: ${ err }`);
}