  // models/Student.js

  const mongoose = require('mongoose');

  const studentSchema = new mongoose.Schema({
    registerNo: { type: String, required: true },
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    course: { type: String },
    department: { type: String, required: true },
    class: { type: String, required: true },
    password: { type: String, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  });

  module.exports = mongoose.model('Student', studentSchema);

