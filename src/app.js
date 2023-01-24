/**
 * 
 * app.js | main process
 * 
 */

// module vars
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// ours module
const db = require('./database.js').get();
console.log('The database is connected with you!');

// vars
// setup express
const app = express();

// extends express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setup routes
let routeFiles = fs.readdirSync(path.join(__dirname, 'routes'));
for(const index in routeFiles) {
    let currentRoutePath = routeFiles[index];
    require(`./routes/${currentRoutePath}`)(app);
}

// close database. Setup others
db.close();
app.listen(process.env.PORT || 3000, () => {
    console.log(`[YieldCode] Running your web application at port ${process.env.PORT || 3000}`);
});