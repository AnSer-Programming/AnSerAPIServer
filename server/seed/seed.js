try {
    const sequelize = require('../config/connection');
    const { OnTimeTable } = require('../models');
    const onTimeData = require('./onTimeData.json');
    const seedDatabase = async () => {
        await sequelize.sync({ force: true });   
        await OnTimeTable.bulkCreate(onTimeData, {
            returning: true,
        });
        process.exit(0);
    };
    
    seedDatabase();
} catch(err) {
    console.log(`Seed Error: ${ err }`);
}