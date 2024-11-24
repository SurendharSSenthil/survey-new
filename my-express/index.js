const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

if (!process.env.MONGODB_CONNECTION_STRING) {
	console.error(
		"MONGODB_CONNECTION_STRING is not set. Please set it in your environment."
	);
	process.exit(1);
}

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: "course_evaluation-IV-sem",
});

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
	console.log(`Express Listening on ${port}`);
});
