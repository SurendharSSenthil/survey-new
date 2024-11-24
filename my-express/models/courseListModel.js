const mongoose = require('mongoose');

const questionschema = new mongoose.Schema({
    qid: Number,
    question: String
});

const courseListSchema = new mongoose.Schema({
  coursecode: String,
  coursename: String,
  questions: [questionschema]
});

module.exports = mongoose.model('iiiyrcourselist', courseListSchema);
