const StudentIDModel = require("../models/nameListModel");
const coursesModel = require("../models/courseListModel");
const Student = require("../models/studentModel");
const studentDataSchema = require("../models/studentdataModel");

exports.authenticateStudent = async (req, res) => {
	const studentAuth = req.body;
	console.log(studentAuth);
	const studentID = studentAuth.regNo;
	const studentDOB = studentAuth.dob;
	try {
		const isFound = await StudentIDModel.find({
			RegNo: studentID,
			DOB: studentDOB,
		});
		console.log(isFound);
		if (isFound.length > 0) {
			res.json(isFound);
		} else {
			res.json("Wrong password");
		}
	} catch (err) {
		console.error("Error retrieving student data:", err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getStudentData = async (req, res) => {
	const studentId = req.params.id;
	console.log(studentId);
	try {
		const studentData = await studentDataSchema.findOne({ stdId: studentId });
		console.log(studentData);
		if (studentData) {
			res.json(studentData);
		} else {
			res.json("Student Not Found");
		}
	} catch (error) {
		console.error("Error retrieving student data:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.getCourseQuestions = async (req, res) => {
	try {
		const coursecode = req.params.course;
		console.log(coursecode);
		console.log(coursesModel);
		const data = await coursesModel.find({ coursecode });
		console.log(data);
		res.send(data[0]);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.countCourseSubmissions = async (req, res) => {
	const subject = req.params.std;
	console.log(subject);
	try {
		const stdCount = await Student.countDocuments({ stdId: subject });
		console.log(stdCount);
		res.json(stdCount);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.submitForm = async (req, res) => {
	const formData = req.body;
	console.log(formData);

	try {
		console.log(formData.courseId);
		const newStudent = new Student({
			stdName: formData.stdName,
			stdId: formData.regNo,
			email: formData.email,
			phNo: formData.phNo,
			courseName: formData.courseName,
			courseId: formData.courseId,
			sem: formData.sem,
			year: formData.year,
			responses: formData.responses,
		});
		const duplicateEntry = await Student.countDocuments({
			stdId: formData.regNo,
			courseName: formData.courseName,
		});
		if (duplicateEntry !== 0) {
			res.json("Duplicate Entry");
			console.log(duplicateEntry);
		} else {
			console.log(duplicateEntry);
			await newStudent.save();

			console.log("Document successfully inserted");
			res.json({ message: "Form Successfully Submitted!" });
		}
	} catch (e) {
		console.log("Error Occurred:", e.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
