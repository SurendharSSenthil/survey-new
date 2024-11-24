const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
	qid: Number,
	question: String,
	response: String,
});

const studentSchema = new mongoose.Schema({
	stdName: {
		type: String,
		required: true,
	},
	stdId: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	phNo: {
		type: String,
	},
	courseName: {
		type: String,
		required: true,
	},
	courseId: {
		type: String,
		required: true,
	},
	sem: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
	responses: {
		type: [responseSchema],
		required: true,
	},
});

module.exports = mongoose.model('iiiyrresponse', studentSchema);
