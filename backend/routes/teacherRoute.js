const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

// Add a new teacher
router.post('/teachers', async (req, res) => {
  const { userId, name, password } = req.body;

  const existingTeacher = await Teacher.findOne({ userId });
  if (existingTeacher) {
    return res.status(400).json({ message: 'User ID already exists' });
  }

  try {
    const newTeacher = new Teacher({ userId, name, password });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all teachers
router.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('subjects');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/teachers/count', async (req, res) => {
  try {
      const count = await Teacher.countDocuments();
      res.json({ count });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching teachers count' });
  }
});

// Add a new subject
router.post('/subjects', async (req, res) => {
  const { subName, className, classId, department, course, teacherId } = req.body;

  try {
    console.log("Request received to add a new subject:");
    console.log("subName:", subName);
    console.log("className:", className);
    console.log("classId:", classId);
    console.log("department:", department);
    console.log("course:", course);
    console.log("teacherId:", teacherId);

    const newSubject = new Subject({ subName, className, classId, department, course, teacherId });
    console.log("New subject instance created:", newSubject);

    await newSubject.save();
    console.log("New subject saved to the database");

    // Associate the subject with the teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new Error(`Teacher with ID ${teacherId} not found`);
    }

    teacher.subjects.push(newSubject._id);
    await teacher.save();
    console.log("Teacher updated with new subject");

    res.status(201).json(newSubject);
  } catch (err) {
    console.error('Error while adding a new subject:', err.message);
    res.status(500).json({ message: err.message });
  }
});


// Get subjects based on classId
router.get('/subjects', async (req, res) => {
  const { classId } = req.query;

  try {
    const subjects = await Subject.find({ classId }).populate('teacherId');
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
