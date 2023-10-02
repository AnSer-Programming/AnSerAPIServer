var ISOLATION_LEVEL = require('tedious').ISOLATION_LEVEL;
let config;

try {
    const Sequelize = require('sequelize');
    const dotenv = require("dotenv");
    
    dotenv.config();
    
    config = new Sequelize(
        `${ process.env.DB_NAME_PRODUCTION_IS }`,`${ process.env.DB_USER }`,`${ process.env.DB_PWD }`,
        {
            "host": `${ process.env.DB_SERVER_PRODUCTION }`,
            "dialect": 'mssql',
            "port": 1433,
            "encrypt": false,
            "authentication": {
                "type": "default",
                "options": {  
                    "userName": `${ process.env.DB_USER }`,
                    "password": `${ process.env.DB_PWD }`,
                }
            },
            "options": {
                "port": 1433,
                "encrypt": false,
                "enableArithAbort": true,
                "connectionIsolationLevel": ISOLATION_LEVEL.READ_UNCOMMITTED,
                "validateBulkLoadParameters": false,
                "rowCollectionOnRequestCompletion": true,
                "database": `${ process.env.DB_NAME_PRODUCTION_IS }`
            }
        }
    );
    
    module.exports = config;
} catch(err) {
    console.log(`Connection File: ${ err }`);
}