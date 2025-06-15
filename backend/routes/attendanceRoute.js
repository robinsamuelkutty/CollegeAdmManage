const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
// Add new attendance record
const handleDateToUTC = (date) => {
  const utcDate = new Date(date);
  // Convert local date to UTC
  return new Date(Date.UTC(
    utcDate.getFullYear(),
    utcDate.getMonth(),
    utcDate.getDate(),
    utcDate.getHours(),
    utcDate.getMinutes(),
    utcDate.getSeconds()
  ));
};

router.post('/attendance', async (req, res) => {
  const { studentId, subjectId, date, hour, status, lessonPlan, deliveryMethods } = req.body;
  const utcDate = handleDateToUTC(date); // Convert date to UTC

  console.log('Creating attendance:', { studentId, subjectId, date: utcDate, hour, status });

  try {
    const newAttendance = new Attendance({ studentId, subjectId, date: utcDate, hour, status, lessonPlan,deliveryMethods});
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (err) {
    console.error('Error creating attendance:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});



// Get attendance records by student ID and subject ID
router.get('/attendance', async (req, res) => {
  const { studentId, subjectId } = req.query;

  try {
    const query = {};
    if (studentId) query.studentId = studentId;
    if (subjectId) query.subjectId = subjectId;

    const attendanceRecords = await Attendance.find(query);
    res.json(attendanceRecords);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/attendance', async (req, res) => {
  const { attendanceData, subjectId, date, hour } = req.body;
  const utcDate = handleDateToUTC(date); 
  try {
    for (const [studentId, status] of Object.entries(attendanceData)) {
      console.log({
        studentId,
        subjectId,
        date: utcDate,
        hour
      });

      const existingRecord = await Attendance.findOne({ studentId, subjectId, date: utcDate, hour });
      console.log('Existing Record:', existingRecord);

      if (existingRecord) {
        const result = await Attendance.findOneAndUpdate(
          { studentId, subjectId, date: utcDate, hour },
          { status },
          { new: true }
        );
        console.log("Updated Record:", result);
      } else {
        console.log(`No record found for studentId: ${studentId}, subjectId: ${subjectId}, date: ${date}, hour: ${hour}`);
      }
    }
    res.status(200).json({ message: 'Attendance updated successfully' });
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});



router.get('/attendance/student/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Fetch the student data
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    console.log("student in attendance",student)
    // Fetch subjects based on the student's class, department, and course
    const subjects = await Subject.find({
      className: student.class,
      department: student.department,
      course: student.course,
    });
    console.log("subject in attendance",subjects)
    const subjectIds = subjects.map(sub => sub._id);

    // Fetch attendance records for these subjects
    const attendanceRecords = await Attendance.find({ studentId, subjectId: { $in: subjectIds } });

    // Aggregate attendance data
    const subjectAttendance = subjects.map(subject => {
      const totalClasses = attendanceRecords.filter(record => record.subjectId.equals(subject._id)).length;
      const attendedClasses = attendanceRecords.filter(record => record.subjectId.equals(subject._id) && record.status === 'present').length;
      return {
        name: subject.subName,
        attendedClasses,
        totalClasses,
      };
    });

    res.json(subjectAttendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const handleDateConversion = (date) => {
  const localDate = new Date(date);
  // Adjust date to local timezone
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate;
};

router.get('/attendance/student', async (req, res) => {
  const { studentId, date, subjectId } = req.query; // Include subjectId in query
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    // Fetch attendance records for the specific subject
    const attendanceRecords = await Attendance.find({
      studentId,
      subjectId, // Filter by subjectId
      date: { $gte: startDate, $lte: endDate },
    });

    // Convert UTC dates to local dates for display
    const hourAttendance = attendanceRecords.map(record => ({
      hour: record.hour,
      status: record.status,
      date: new Date(record.date).toLocaleDateString(),
      lessonPlan: record.lessonPlan, 
      deliveryMethods: record.deliveryMethods 
    }));

    console.log('Fetched attendance records:', hourAttendance);

    res.json(hourAttendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/attendanceviewday/student', async (req, res) => {
  const { studentId, date } = req.query;
  console.log("studentIDD",studentId)
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    console.log("student from edit attendance",student)
    const subjects = await Subject.find({
      className: student.class,
      department: student.department,
      course: student.course,
    });

    const subjectIds = subjects.map(sub => sub._id);

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      studentId,
      subjectId: { $in: subjectIds },
      date: { $gte: startDate, $lte: endDate },
    });

    // Convert UTC dates to local dates for display
    const hourAttendance = attendanceRecords.map(record => ({
      hour: record.hour,
      status: record.status,
      date: new Date(record.date).toLocaleDateString() ,
      lessonPlan: record.lessonPlan, // Include lesson plan
      deliveryMethods: record.deliveryMethods // Convert to local date string
    }));

    console.log('Fetched attendance records:', hourAttendance);

    res.json(hourAttendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/test', (req, res) => {
  const { subjectId } = req.query;
  console.log("Received Subject ID in /test route:", subjectId);

  res.json({ subjectId });
});




module.exports = router;
