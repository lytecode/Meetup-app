const mongoose = require('mongoose');
require('dotenv').config();


//connection to database
mongoose.connect('mongodb://localhost/meetup' || process.env.MongoDB_URI);
const db = mongoose.connection;
db.on('connected', () => console.log('db connected successfully'));
db.on('error', () => console.log('Ooops! Something went wrong with db connection'));


module.exports = db;