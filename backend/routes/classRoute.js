// routes/classes.js
const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

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

module.exports = router;
