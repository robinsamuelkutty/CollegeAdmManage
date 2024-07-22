const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
// Create a new student
router.post('/students', async (req, res) => {
  console.log('Received data for new student:', req.body);

  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    const { class: studentClass, department, course } = req.query;

    // Create a query object based on provided parameters
    const query = {};
    if (studentClass) query.class = studentClass;
    if (department) query.department = department;
    if (course) query.course = course;

    const students = await Student.find(query).sort({ rollNo: 1 });
    console.log("Fetched students:", students);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all students, optionally filtered by class
router.get('/students', async (req, res) => {
  try {
    const { class: studentClass } = req.query;
    const filter = studentClass ? { class: studentClass } : {};
    const students = await Student.find(filter);
    console.log(students)
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/students/count', async (req, res) => {
  try {
      const count = await Student.countDocuments();
      res.json({ count });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching students count' });
  }
});



// Update a student
router.put('/students/:id', async (req, res) => {
  console.log(`Updating student with ID: ${req.params.id}`);
  const { course, department, class: studentClass } = req.body;

  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.course = course || student.course;
    student.department = department || student.department;
    student.class = studentClass || student.class;

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Error updating student' });
  }
});

// Delete a student
router.delete('/students/:id', async (req, res) => {
  console.log(`Deleting student with ID: ${req.params.id}`);
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get count of students in each course
router.get('/students/count-by-course', async (req, res) => {
  try {
    const counts = await Student.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } }
    ]);

    const formattedCounts = counts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json(formattedCounts);
  } catch (err) {
    console.error('Error fetching student counts by course:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
