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
    if(fs.existsSync(process.env.SQLITE_PATH)) {
        db = new sqlite.Database(process.env.SQLITE_PATH);
    } else {
        db = new sqlite.Database(process.env.SQLITE_PATH, (error) => {
            if(error) {
                return console.error(error.message);
            }

            // create database
            db.exec(`
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username VARCHAR(50) NOT NULL,
                    password VARCHAR(150) NOT NULL,
                    discord_id VARCHAR(20) NOT NULL,
                    created_date VARCHAR(60) NULL,
                    role VARCHAR(10) DEFAULT 'user',
                    access_token VARCHAR(100) NULL
                );

                CREATE TABLE products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    resource_name VARCHAR(50) NOT NULL,
                    title VARCHAR(70) NOT NULL,
                    detail TEXT NULL,
                    released_date VARCHAR(40) NOT NULL,
                    version VARCHAR(15) NOT NULL,
                    price DOUBLE NOT NULL,
                    thumbnail VARCHAR(60) NULL
                );

                CREATE TABLE payment_transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INT(10) NOT NULL,
                    amount DOUBLE NOT NULL,
                    created_date VARCHAR(60) NULL,
                    slip_url VARCHAR(120) NOT NULL,
                    status INT(1) NOT NULL
                );

                CREATE TABLE licenses (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INT(10) NOT NULL,
                    product_id INT(10) NOT NULL,
                    product_secret_key VARCHAR(30) NOT NULL,
                    static_ip VARCHAR(30) NOT NULL,
                    last_updated_ip INT(15) NOT NULL
                );
            `);
        });
    }

    return db;
};