require('dotenv').config();
const { Database } = require('sqlite3');

const fs = require('fs');
const sqlite = require('sqlite3').verbose();

/**
 * 
 * @return {Database} the sqlite3 database instance
 */
module.exports.get = () => {
    let db;
    if(fs.existsSync(process.env.sqlite_path)) {
        db = new sqlite.Database(process.env.sqlite_path);
    } else {
        db = new sqlite.Database(process.env.sqlite_path, (error) => {
            if(error) {
                return console.error(error.message);
            }

            db.exec(`
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(50) NOT NULL,
                    password VARCHAR(50) NOT NULL,
                    discord_id VARCHAR(20) NOT NULL,
                    created_date VARCHAR(60) NULL  
                )
            `);
        });
    }

    return db;
};