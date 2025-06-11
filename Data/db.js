const db = require('mysql2/promise')

const connection = db.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'Junior1574.',
    database: 'banco_bio'
});


module.exports = connection;