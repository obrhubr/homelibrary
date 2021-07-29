const Pool = require('pg').Pool;

function connectPG() {
    let pgPool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DB,
        password: process.env.PG_PASSWORD,
        port: 5432,
    });

    return pgPool;
};

module.exports = {
    connectPG,
};