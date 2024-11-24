const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
	courseCode: String,
	courseName: String,
});

const studentDataSchema = new mongoose.Schema({
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
	courselist: {
		type: Object,
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
});

module.exports = mongoose.model('iiiyrstudent', studentDataSchema);
