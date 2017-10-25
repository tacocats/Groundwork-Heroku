var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//Activity Schema
var ActivitySchema = mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	description: {
		type: String,

	}
});

var Activity = module.exports = mongoose.model('Activity', ActivitySchema);

module.exports.createActivity = function(newActivity, callback) {
    newActivity.save(callback);
}