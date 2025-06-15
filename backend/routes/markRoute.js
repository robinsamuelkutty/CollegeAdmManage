

const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Class = require("../models/Class")

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
router.put('/marksforlab/:studentId', async (req, res) => {
  const { subject,testName, CEL, CAT, viva, teacherId } = req.body;
  const { studentId } = req.params;

  try {
    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the mark entry by studentId, subject, and teacherId
    let markEntry = await Mark.findOne({ studentId, subject,testName, teacherId });

    if (markEntry) {
      // If the mark entry exists, update the respective fields
      if (CEL !== undefined) markEntry.CEL = CEL;
      if (CAT !== undefined) markEntry.CAT = CAT;
      if (viva !== undefined) markEntry.viva = viva;
    } else {
      // If no existing entry, create a new one
      markEntry = new Mark({
        studentId,
        subject,
        testName,
        CEL,
        CAT,
        viva,
        teacherId
      });
    }

    // Save the mark entry
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
    }).populate('studentId', 'registerNo rollNo name');

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
// Calculate internal marks


// Calculate internal marks
router.get('/internalmarks', async (req, res) => {
  const { className, department, course, subject } = req.query;

  try {
    // Find students in the specified class, department, and course
    const students = await Student.find({ class: className, department, course });

    // Extract student IDs
    const studentIds = students.map(student => student._id);

    // Find the subject ID based on subject name
    const subjectData = await Subject.findOne({ subName: subject.subName, className, department, course }).populate('teacherId'); ;
    if (!subjectData) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Fetch marks for those students for the given subject
    const marks = await Mark.find({
      studentId: { $in: studentIds },
      subject: subjectData._id
    }).populate('studentId', 'rollNo name registerNo');

    // Calculate attendance percentage for each student
    const calculateAttendancePercentage = async (studentId, subjectId) => {
      const totalClasses = await Attendance.countDocuments({ studentId, subjectId });
      const attendedClasses = await Attendance.countDocuments({ studentId, subjectId, status: 'present' });

      return totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : 0;
    };

    // Calculate internal marks based on attendance, assignment, and series scores
    const calculatedMarks = await Promise.all(marks.map(async (mark) => {
      const attendancePercentage = await calculateAttendancePercentage(mark.studentId._id, subjectData._id);

      let attendanceMark = 0;
      if (attendancePercentage > 90) {
        attendanceMark = 10;
      } else if (attendancePercentage > 80) {
        attendanceMark = 9;
      } else if (attendancePercentage > 70) {
        attendanceMark = 8;
      } else if (attendancePercentage > 60) {
        attendanceMark = 7;
      }else if (attendancePercentage > 50) {
        attendanceMark = 6;
      }else if (attendancePercentage > 40) {
        attendanceMark = 5;
      }else if (attendancePercentage > 30) {
        attendanceMark = 4;
      }else if (attendancePercentage > 20) {
        attendanceMark = 3;
      }

      // Initialize assignment and series scores
      let assignmentMark = 0;
      let firstSeries = 0;
      let secondSeries = 0;

      // Extract assignment and series scores
      if (mark.testName === 'Assignment') {
        assignmentMark = mark.mark || 0;
      } else if (mark.testName === '1st Series') {
        firstSeries = mark.mark || 0;
      } else if (mark.testName === '2nd Series') {
        secondSeries = mark.mark || 0;
      }

      
 

      return {
        registerNo:mark.studentId.registerNo,
        rollNo: mark.studentId.rollNo,
        name: mark.studentId.name,
        firstSeries,
        secondSeries,
        assignmentMark,
        attendanceMark,
        attendancePercentage,
        
        
      };
    }));

    res.status(200).json(
      calculatedMarks  );
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to calculate attendance percentage
const calculateAttendancePercentage = async (studentId, subjectId) => {
  const totalClasses = await Attendance.countDocuments({ studentId, subjectId });
  const attendedClasses = await Attendance.countDocuments({ studentId, subjectId, status: 'present' });

  return totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
};

router.get('/studentinternalmark', async (req, res) => {
  const { studentId } = req.query;

  try {
    // Fetch the student data and populate class information
    const studentData = await Student.findById(studentId).populate('classId');

    if (!studentData || !studentData.classId) {
      return res.status(404).json({ message: 'Student or class not found' });
    }

    // Get the class ID for fetching subjects
    const studentClassId = studentData.classId._id;
    

    // Fetch subjects related to the student's class
    const subjects = await Subject.find({ classId: studentClassId });
    console.log("subject data", subjects);

    // Iterate over subjects to fetch marks
    const marks = await Promise.all(subjects.map(async (subject) => {
      // Fetch marks for each subject
      const markData = await Mark.find({
        studentId,
        subject: subject._id
      }).populate('subject', 'subName');

      // Calculate attendance percentage and internal marks
      const attendancePercentage = await calculateAttendancePercentage(studentId, subject._id);
      let attendanceMark = 0;
      if (attendancePercentage > 90) {
        attendanceMark = 10;
      } else if (attendancePercentage > 80) {
        attendanceMark = 9;
      } else if (attendancePercentage > 70) {
        attendanceMark = 8;
      } else if (attendancePercentage > 60) {
        attendanceMark = 7;
      } else if (attendancePercentage > 50) {
        attendanceMark = 6;
      } else if (attendancePercentage > 40) {
        attendanceMark = 5;
      } else if (attendancePercentage > 30) {
        attendanceMark = 4;
      } else if (attendancePercentage > 20) {
        attendanceMark = 3;
      }

      // Initialize assignment and series scores
      let assignmentMark = 0;
      let firstSeries = 0;
      let secondSeries = 0;

      // Extract assignment and series scores
      for (const mark of markData) {
        if (mark.testName === 'Assignment') {
          assignmentMark = mark.mark || 0;
        } else if (mark.testName === '1st Series') {
          firstSeries = mark.mark || 0;
        } else if (mark.testName === '2nd Series') {
          secondSeries = mark.mark || 0;
        }
      }

      // Calculate internal mark
      const seriesScore = (firstSeries + secondSeries) / 4;
      const internalMark = seriesScore + assignmentMark + attendanceMark;
      console.log("subject in return", subject);
      return {
        subject,
        firstSeries,
        secondSeries,
        assignmentMark,
        attendanceMark,
        internalMark,
        attendancePercentage
       
      };
    }));

    res.status(200).json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/studentlabinternalmark', async (req, res) => {
  const { studentId } = req.query;

  try {
    // Fetch the student data and populate class information
    const studentData = await Student.findById(studentId).populate('classId');

    if (!studentData || !studentData.classId) {
      return res.status(404).json({ message: 'Student or class not found' });
    }

    // Get the class ID for fetching subjects
    const studentClassId = studentData.classId._id;
    
    // Fetch subjects related to the student's class
    const subjects = await Subject.find({ classId: studentClassId });

    // Iterate over subjects to fetch marks
    const marks = await Promise.all(subjects.map(async (subject) => {
      // Fetch marks for the subject related to the student
      const markData = await Mark.findOne({
        studentId,
        subject: subject._id
      }).populate('subject', 'subName');
      console.log("mark data",markData)
      // If no marks found for this subject, skip it
      if (!markData) {
        return null;
      }

      // Calculate attendance percentage and attendance mark
      const attendancePercentage = await calculateAttendancePercentage(studentId, subject._id);
      const attendanceMark = (attendancePercentage / 100) * 15;
      
      // Extract CEL, CAT, and viva marks
      const CEL = markData.CEL || 0;
      const CAT = markData.CAT || 0;
      const viva = markData.viva || 0;
      
      // Calculate internal mark
      const internalMark = attendanceMark + CEL + CAT + viva;
      console.log("internal mark",internalMark)
      return {
        subject,
        attendanceMark,
        CEL,
        CAT,
        viva,
        internalMark
      };
    }));

    // Filter out any null results (subjects without marks)
    const filteredMarks = marks.filter(mark => mark !== null);

    res.status(200).json(filteredMarks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.get('/subjectsforCT', async (req, res) => {
  try {
    const { course, department, className } = req.query;
    console.log("course",course,department,className)
    const subjects = await Subject.find({ course, department, className });

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ message: 'No subjects found for this class' });
    }

    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
