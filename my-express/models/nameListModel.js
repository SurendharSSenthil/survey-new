const mongoose = require('mongoose');

const nameListSchema = new mongoose.Schema({
  SNo: Number,
  RegNo: String,
  StdName: String,
  DOB: String
});

module.exports = mongoose.model('iiiyrnamelist', nameListSchema);
