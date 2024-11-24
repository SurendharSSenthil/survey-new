const coursesModel = require('../models/courseListModel');
const nameListSchema = require('../models/nameListModel');
const Student = require('../models/studentModel');
const studentDataSchema = require('../models/studentdataModel');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const multer = require('multer');

exports.getCourseList = async (req, res) => {
  try {
    const data = await coursesModel.find({}, { coursename: 1, coursecode: 1 });
    console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getMarkData = async (req, res) => {
  try {
    const { coursecode, category } = req.body;
    let qid = 0;
    switch (category) {
      case 'CO1': qid = 1; break;
      case 'CO2': qid = 2; break;
      case 'CO3': qid = 3; break;
      case 'CO4': qid = 4; break;
      case 'CO5': qid = 5; break;
      case 'CO6': qid = 6; break;
    }
    const responses = await Student.aggregate([
      {
        $match: { courseId: coursecode }
      },
      {
        $unwind: "$responses"
      },
      {
        $match: { "responses.qid": qid }
      },
      {
        $group: {
          _id: {
            courseId: "$courseId",
            qid: "$responses.qid"
          },
          totalScore: {
            $sum: {
              $switch: {
                branches: [
                  { case: { $eq: ["$responses.response", "Strongly agree"] }, then: 5 },
                  { case: { $eq: ["$responses.response", "Agree"] }, then: 4 },
                  { case: { $eq: ["$responses.response", "Neutral"] }, then: 3 },
                  { case: { $eq: ["$responses.response", "Disagree"] }, then: 2 },
                ],
                default: 1
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          courseId: "$_id.courseId",
          qid: "$_id.qid",
          totalScore: 1
        }
      }
    ]);
    console.log(responses);
    res.send(responses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getResponseData = async (req, res) => {
  const { studentId, courseCode } = req.body;
  console.log(studentId, courseCode);
  try {
    const data = await Student.find({ stdId: studentId, courseId: courseCode });
    console.log(data);
    res.send(data[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.countStudentSubmissions = async (req, res) => {
  const student = req.params.sub;
  console.log(student);
  try {
    const resCount = await Student.countDocuments({ courseId: student });
    console.log(resCount);
    res.json(resCount);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudentList = async (req, res) => {
    console.log(req.params.sem)
  const stdList = await studentDataSchema.find({sem: req.params.sem});
  console.log(stdList);
  res.json(stdList);
};

exports.addData = async (req, res) => {
  try {
    if (!req.files.studentDetailsFile || !req.files.courseListFile) {
      return res.status(400).json({ error: 'Both student details and course list files are required.' });
    }

    const studentsFilePath = path.normalize(req.files.studentDetailsFile[0].path);
    const coursesFilePath = path.normalize(req.files.courseListFile[0].path);

    const studentsData = [];
    const coursesData = {};

    console.log('Processing course list file...');
    // Parse the course list file
    const coursesPromise = new Promise((resolve, reject) => {
      fs.createReadStream(coursesFilePath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            const { coursecode, coursename } = row;
            coursesData[coursecode] = coursename; // Store courses as a key-value pair for easy lookup
          } catch (error) {
            console.error('Error parsing course row:', row, error);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log('Processing student details file...');
    // Parse the student details file
    const studentsPromise = new Promise((resolve, reject) => {
      fs.createReadStream(studentsFilePath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            const { RegNo, StdName, DOB, courselist, email, phNo, sem, year } = row;
            const courseList = JSON.parse(courselist.replace(/""/g, '"'));
            studentsData.push({
              RegNo,
              StdName,
              DOB,
              courselist: courseList, 
              email,
              phNo,
              sem,
              year,
            });
          } catch (error) {
            console.error('Error parsing student row:', row, error);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Wait for both files to process
    await Promise.all([coursesPromise, studentsPromise]);
    console.log(coursesData);
    console.log('Updating student database...');
    for (const student of studentsData) {
      const { RegNo, StdName, DOB, courselist, email, phNo, sem, year } = student;

      // Map course IDs to course names
      const courseDetails = {};
      for (const courseId of courselist) {
        courseDetails[courseId] = coursesData[courseId] || 'Unknown Course'; // Fallback for unknown courses
      }
      console.log('@update', student)
      // Update student data
      await nameListSchema.updateOne(
        { RegNo },
        { $set: { RegNo, StdName, DOB } },
        { upsert: true }
      );

      await studentDataSchema.updateOne(
        { stdId: RegNo },
        {
          $set: {
            stdId: RegNo,
            stdName: StdName,
            courselist: courseDetails, // Populate as an object
            sem,
            year,
            email,
            phNo,
          },
        },
        { upsert: true }
      );
    }

    console.log('Student database updated successfully.');
    res.json({ message: 'Data uploaded and student collection updated successfully.' });
  } catch (err) {
    console.error('Error during data upload:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to parse a CSV file and return its parsed data
const parseCSV = (filePath) => {
  console.log(filePath);
  return new Promise((resolve, reject) => {
    const data = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', () => {
        // Once parsing is done, resolve with the parsed data
        resolve(data);
      })
      .on('error', (err) => {
        // Reject with the error if there's a problem parsing
        reject(err);
      });
  });
};

