const mongoose = require('mongoose'),
	  Schema = mongoose.Schema,
	  passportLocalMongoose = require('passport-local-mongoose');

//make a schema
const UserSchema = new Schema({
	username: String,
	password: String,
	isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);


//eport the model
module.exports = mongoose.model('User', UserSchema);

