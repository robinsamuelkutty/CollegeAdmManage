

const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
// Add or update a mark
router.put('/marks/:studentId', async (req, res) => {
  const { subject, testName, mark, teacherId } = req.body;
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let markEntry = await Mark.findOne({ studentId, subject, testName, teacherId });

    if (markEntry) {
      markEntry.mark = mark; // Update existing mark
    } else {
      markEntry = new Mark({ studentId, subject, testName, mark, teacherId }); // Create new mark entry
    }

    await markEntry.save();
    res.status(200).json(markEntry);
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get marks for a student
router.get('/marks/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const marks = await Mark.find({ studentId });
    res.status(200).json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Get marks for a class, department, course, subject, and test name
router.get('/marks', async (req, res) => {
  const { className, department, course, subject, testName } = req.query;

  try {
    // Find students in the specified class, department, and course
    const students = await Student.find({ class: className, department, course });

    // Extract student IDs
    const studentIds = students.map(student => student._id);

    // Find the subject ID based on subject name
    const subjectData = await Subject.findOne({ subName: subject.subName, className, department, course });
    console.log("subject data Get", subjectData)
    if (!subjectData) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Fetch marks for those students for the given subject and test name
    const marks = await Mark.find({
      studentId: { $in: studentIds },
      subject: subjectData._id,
      testName
    }).populate('studentId', 'rollNo name');

    res.status(200).json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint for fetching marks based on test name
router.get('/marksofsubject', async (req, res) => {
  const { studentId, testName } = req.query;

  try {
    const marks = await Mark.find({
      studentId,
      testName,
    }).populate('subject', 'subName');

    res.status(200).json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
