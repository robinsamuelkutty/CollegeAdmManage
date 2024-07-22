const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Department = require('../models/Department');

// Get all courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new course
router.post('/courses', async (req, res) => {
  const { name } = req.body;

  try {
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    const newCourse = new Course({ name });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Get departments by course
router.get('/departments', async (req, res) => {
  const { course } = req.query;

  try {
    const courseData = await Course.findOne({ name: course }).populate('departments');
    if (!courseData) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(courseData.departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new department
router.post('/departments', async (req, res) => {
  const { name, course } = req.body;

  try {
    const courseData = await Course.findOne({ name: course });
    if (!courseData) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newDepartment = new Department({ name, course: courseData._id });
    const savedDepartment = await newDepartment.save();

    courseData.departments.push(savedDepartment._id);
    await courseData.save();

    res.status(201).json(savedDepartment);
  } catch (err) {
    console.error('Error adding department:', err); // Log error
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// Update a department
router.put('/departments/:id', async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedDepartment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a department
router.delete('/departments/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

