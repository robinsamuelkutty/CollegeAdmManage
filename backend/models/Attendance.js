// models/Attendance.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  
  date: {
    type: Date,
    required: true
  },
  hour: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
  },
  lessonPlan: {
    type: String,
    
  },
  deliveryMethods: {
    type: [String],
    
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
