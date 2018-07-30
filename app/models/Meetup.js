const mongoose = require('mongoose');


const meetupSchema = new mongoose.schema({
	group: String,
	topic: String,
	venue: String,
	time: String,
	banner: String,
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	registered: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	]
});

const Meetup = mongoose.model('Meetup', meetupSchema);

module.exports = Meetup;