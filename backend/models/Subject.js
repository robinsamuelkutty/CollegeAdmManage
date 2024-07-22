const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  course: {
    type: String
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;

