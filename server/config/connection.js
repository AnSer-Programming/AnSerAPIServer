var ISOLATION_LEVEL = require('tedious').ISOLATION_LEVEL;
const dotenv = require("dotenv");

dotenv.config();

const config = {
    server: `${ process.env.DB_SERVER }`,
    options: {
        encrypt: true,
        enableArithAbort: true,
        connectionIsolationLevel: ISOLATION_LEVEL.READ_UNCOMMITTED,
        validateBulkLoadParameters: false,
        rowCollectionOnRequestCompletion: true,
        database: "DATABASE"
    },
    authentication: {
      type: "default",
      options: {  
        userName: `${ process.env.DB_USER }`,
        password: `${ process.env.DB_PWD }`,
      }
    }
    // server: `${ process.env.DB_SERVER }`,
    // userName: `${ process.env.DB_USER }`,
    // password: `${ process.env.DB_PWD }`,
    // options: {
    //     encrypt: true,
    //     enableArithAbort: true,
    //     connectionIsolationLevel: ISOLATION_LEVEL.READ_UNCOMMITTED
    // }
};

module.exports = config;