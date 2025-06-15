// routes/classes.js
const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

const Student = require('../models/Student');
// Get all classes for a specific department
router.get('/classes', async (req, res) => {
  const { departmentId } = req.query;
  try {
    const classes = await Class.find({ departmentId });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes', error });
  }
});

// Add a new class
router.post('/classes', async (req, res) => {
  const { name, departmentId } = req.body;
  const newClass = new Class({ name, departmentId });

  try {
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error adding class', error });
  }
});

// Edit a class
router.put('/classes/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedClass = await Class.findByIdAndUpdate(id, { name }, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Error updating class', error });
  }
});

// Delete a class
router.delete('/classes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Class.findByIdAndDelete(id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting class', error });
  }
});
router.get('/totalclasses', async (req, res) => {
  const { className, department, course, subject } = req.query;

  try {
    // Fetch subjects based on the parameters
    const subjects = await Subject.find({
      className,
      department,
      course,
      subjectId:subject.id // Use the field name for the subject
    });
    console.log("total clases",className,
      department,
      course,
      subject )
    const subjectIds = subjects.map(sub => sub._id);
    
    // Count the total number of classes for these subjects
    const totalClasses = await Attendance.countDocuments({
      subjectId: { $in: subjectIds }
    });
   
    res.json({ totalClasses });
  } catch (err) {
    console.error('Error fetching total number of classes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/courseplan', async (req, res) => {
  const { subjectId } = req.query;

  console.log("Received Subject ID:", subjectId);

  try {
    // Validate the input
    if (!subjectId) {
      return res.status(400).json({ message: 'Subject ID is required' });
    }

    // Query to fetch attendance records for the specified subject
    const attendanceRecords = await Attendance.find({ subjectId })
      .select('date lessonPlan deliveryMethods')
      .sort('date');

    console.log("Attendance records before filtering:", attendanceRecords);

    // Use a Set to filter out duplicates
    const uniqueRecords = [];
    const seenCombinations = new Set();

    attendanceRecords.forEach(record => {
      const combination = `${record.date}-${record.lessonPlan}-${record.deliveryMethods.join(",")}`;
      if (!seenCombinations.has(combination)) {
        seenCombinations.add(combination);
        uniqueRecords.push(record);
      }
    });

    console.log("Filtered unique attendance records:", uniqueRecords);

    res.json(uniqueRecords);
  } catch (err) {
    console.error('Error fetching course plan data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
