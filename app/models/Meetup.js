const mongoose = require('mongoose');


const meetupSchema = new mongoose.Schema({
	group: String,
	topic: String,
	venue: String,
	time: String,
	imageURL: String,
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	registered: [
		// {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: 'User'
		// },
		// username
	]
});

const Meetup = mongoose.model('Meetup', meetupSchema);

module.exports = Meetup;