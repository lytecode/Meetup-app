const mongoose = require('mongoose');


const meetupSchema = new mongoose.schema({
	group: String,
	theme: String,
	description: String,
	venue: String,
	time: String,
	banner: String 
});

const Meetup = mongoose.model('Meetup', meetupSchema);

module.exports = Meetup;