const mongoose = require('mongoose');

//make a schema
const UserSchema = new mongoose.schema({
	username: String,
	password: String

});

//make a User model
const User = mongoose.model('User', UserSchema);


//eport the model
module.exports = User;

