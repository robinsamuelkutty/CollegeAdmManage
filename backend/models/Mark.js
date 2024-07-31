// models/Mark.js

const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId,ref:'Subject', required: true },
  testName: { type: String, required: true },
  mark: { type: Number, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
});

module.exports = mongoose.model('Mark', markSchema);
