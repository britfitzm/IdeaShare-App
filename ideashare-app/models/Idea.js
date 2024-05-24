const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
	text: {
		type: String,
		require: [true, 'Please write something']
	},
	tag: {
		type: String
	},
	username: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Idea', IdeaSchema);
