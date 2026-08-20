const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

const app = require('../backend/src/app');
const connectDB = require('../backend/src/config/db');

// Establish database connection
connectDB();

module.exports = app;
