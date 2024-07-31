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
    const { class: className, department, course } = req.query;

    // Create a query object based on provided parameters
    const query = {};
    if (className) query.class = className;
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

router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Endpoint to get a specific student by registerNo
router.get('/students/:registerNo', async (req, res) => {
  try {
    const student = await Student.findOne({ registerNo: req.params.registerNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error('Error fetching student:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update a student
router.put('/students/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updatedStudent = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(updatedStudent);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});
router.put('/students/:id/marks', async (req, res) => {
  const { subject, testName, mark, teacherId } = req.body; // Include teacherId

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const markEntry = student.marks.find(
      (m) => m.subject === subject && m.testName === testName && m.teacherId.toString() === teacherId
    );

    if (markEntry) {
      markEntry.mark = mark; // Update mark
    } else {
      student.marks.push({ subject, testName, mark, teacherId }); // Add new entry
    }

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).json({ message: 'Internal server error' });
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


// Get count of students in each course
router.get('/students/coursecount', async (req, res) => {
  console.log("into the get")
  try {
    const counts = await Student.aggregate([
      {
        $group: {
          _id: "$course",
          count: { $sum: 1 }
        }
      }
    ]);
    console.log(counts)
    const formattedCounts = counts.reduce((acc, curr) => {
      if (curr._id) { // Ensure the course field is not null
        acc[curr._id] = curr.count;
      }
      return acc;
    }, {});

    res.json(formattedCounts);
  } catch (err) {
    console.error('Error fetching student counts by course:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.post('/students/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const student = await Student.findOne({ registerNo: userId });
    if (!student || student.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Send back the student data or a token
    res.status(200).json({ message: 'Login successful', student });
  } catch (err) {
    console.error('Error during student login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;
