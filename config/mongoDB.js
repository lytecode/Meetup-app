const mongoose = require('mongoose');
require('dotenv').config();


//connection to database
mongoose.connect(process.env.MongoDB_URI || 'mongodb://localhost/meetup');
const db = mongoose.connection;
db.on('connected', () => console.log('db connected successfully'));
db.on('error', () => console.log('Ooops! Something went wrrong with db connection'));


module.exports = db;