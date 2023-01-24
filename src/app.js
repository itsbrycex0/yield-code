/**
 * 
 * app.js | main process
 * 
 */

// module vars
require('dotenv').config();
const Express = require('express');
const BodyParser = require('body-parser');

// ours module
const db = require('./database.js').get();
console.log('Connected to database');

db.exec(`
    INSERT INTO users (username, password, discord_id) VALUES ('frame', 'frame', '123456789')
`);

// vars
// setup express
const app = Express();

// extends express
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));