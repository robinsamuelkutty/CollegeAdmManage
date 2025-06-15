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
router.put('/teachers/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, req.body, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a teacher
router.delete('/teachers/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
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
  const { subName, className, classId, department, course, teacherId, lab } = req.body;

  try {
    console.log("Request received to add a new subject:");
    console.log("subName:", subName);
    console.log("className:", className);
    console.log("classId:", classId);
    console.log("department:", department);
    console.log("course:", course);
    console.log("teacherId:", teacherId);
    console.log("lab:", lab);

    // Create a new subject with the lab flag included
    const newSubject = new Subject({ subName, className, classId, department, course, teacherId, lab });
    console.log("New subject instance created:", newSubject);

    // Save the new subject to the database
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

    // Respond with the newly created subject, including the lab flag
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
// Delete a subject
router.delete('/subjects/:id', async (req, res) => {
  try {
    const subjectId = req.params.id;
    console.log("Attempting to delete subject with ID:", subjectId);
    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
      console.log("Subject not found with ID:", subjectId);
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (err) {
    console.error('Error while deleting subject:', err);
    res.status(500).json({ message: err.message });
  }
});
router.put('/subjects/:id', async (req, res) => {
  try {
    const subjectId = req.params.id;
    const updateData = req.body;

    console.log("Attempting to update subject with ID:", subjectId);
    console.log("Update data:", updateData);

    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, updateData, { new: true });

    if (!updatedSubject) {
      console.log("Subject not found with ID:", subjectId);
      return res.status(404).json({ message: 'Subject not found' });
    }

    console.log("Subject updated successfully:", updatedSubject);
    res.json(updatedSubject);
  } catch (err) {
    console.error('Error while updating subject:', err);
    res.status(500).json({ message: err.message });
  }
});


// Teacher login
router.post('/teachers/login', async (req, res) => {
  const { userId, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ userId });
    if (!teacher || teacher.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Send back the teacher data or a token
    res.status(200).json({ message: 'Login successful', teacher });
  } catch (err) {
    console.error('Error during teacher login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/teachers/:id/subjects', async (req, res) => {
  try {
    const teacherId = req.params.id;
    const subjects = await Subject.find({ teacherId }).populate('classId');
    
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects for teacher:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.post('/teachers/addToClass', async (req, res) => {
  const { teacherId, course, department, class: className, tutor } = req.body;
  console.log("add to class",teacherId, course, department, className, tutor)
  try {
    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    console.log("classes push",course, department, className, tutor)
    // Add class information to the teacher
    teacher.classes = teacher.classes || [];
    teacher.classes.push({ course, department, className, tutor });

    await teacher.save();
    console.log("teacher",teacher)
    res.status(200).json({ message: 'Teacher added to class successfully', teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put('/teachers/update/:id', async (req, res) => {
  const teacherId = req.params.id;
  const updateData = req.body;

  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updateData, { new: true });

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({ message: 'Teacher updated successfully', updatedTeacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/teachers/removeFromClass/:id', async (req, res) => {
  const teacherId = req.params.id;
  const { classId } = req.body;

  try {
    // Find the teacher by ID
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Filter out the class to remove it by class ID
    teacher.classes = teacher.classes.filter(
      (cls) => cls._id.toString() !== classId
    );

    await teacher.save();

    res.status(200).json({ message: 'Teacher removed from class successfully', teacher });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/teachersInClass', async (req, res) => {
  const { tutor } = req.query; // Get tutor from query params
  console.log("boolean",tutor)
  try {
    // Find teachers where any class has tutor field matching the tutor parameter
    const teachers = await Teacher.find({
      'classes.tutor': tutor === 'true'
    }).populate('classes.department')  
    .populate('classes.className');
    console.log("teachers",teachers)
    res.json(teachers);
  } catch (err) {
    console.error('Error fetching teachers in class:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/teachers/:id/classes', async (req, res) => {
  try {
    const teacherId = req.params.id;
    console.log("Received request for teacherId:", teacherId);

    const teacher = await Teacher.findById(teacherId).populate({
      path: 'classes.department',
      model: 'Department'
    }).populate({
      path: 'classes.className',
      model: 'Class'
    });

    if (!teacher) {
      console.log("Teacher not found");
      return res.status(404).json({ message: 'Teacher not found' });
    }

    console.log("Classes found:", teacher.classes);
    res.json(teacher.classes);
  } catch (err) {
    console.error('Error fetching classes for teacher:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/teacher-name', async (req, res) => {
  try {
    const { subjectId } = req.query;

    // Find the subject with the given subjectId and populate the teacher's name
    const subject = await Subject.findById(subjectId).populate('teacherId', 'name');
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const teacherName = subject.teacherId.name;
    
    res.status(200).json({ teacherName });
  } catch (error) {
    console.error('Error fetching teacher name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
