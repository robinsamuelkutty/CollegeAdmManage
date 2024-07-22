const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
