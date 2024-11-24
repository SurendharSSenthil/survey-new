const mongoose = require("mongoose");
const { MONGODB_CONNECTION_STRING } = require("./index");

mongoose.connect(MONGODB_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: "course_evaluation-IV-sem",
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = db;
