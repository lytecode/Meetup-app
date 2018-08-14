const mongoose = require('mongoose');
require('dotenv').config();


//connection to database
mongoose.connect('mongodb://devsquare:dev12345@ds121182.mlab.com:21182/meetup' || 'mongodb://localhost/meetup');
const db = mongoose.connection;
db.on('connected', () => console.log('db connected successfully'));
db.on('error', () => console.log('Ooops! Something went wrong with db connection'));


module.exports = db;