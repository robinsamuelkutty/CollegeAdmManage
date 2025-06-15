import React, { useState, useEffect } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import './viewAttendance.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function ViewAttendance() {
  const location = useLocation();
  const { user, course, department, className, subject } = location.state || {};
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Fetch attendance records for the subject
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendance`, {
          params: {
            course,
            department,
            className,
            subjectId: subject,
          }
        });

        const studentAttendance = response.data;

        // Create a map to store attendance details for each student
        const studentsMap = {};

        studentAttendance.forEach(record => {
          const { studentId, status } = record;

          if (!studentsMap[studentId]) {
            studentsMap[studentId] = { total: 0, attended: 0 };
          }

          studentsMap[studentId].total += 1;
          if (status === 'present') {
            studentsMap[studentId].attended += 1;
          }
        });

        // Fetch students details to get names
        const studentIds = Object.keys(studentsMap);
        const studentDetailsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, {
          params: {
            studentIds,
          }
        });

        const studentsDetails = studentDetailsResponse.data;

        // Calculate attendance percentage and prepare data for display
        const calculatedData = studentsDetails.map(student => ({
          rollNo: student.rollNo,
          name: student.name,
          percentage: studentsMap[student._id]
            ? `${((studentsMap[student._id].attended / studentsMap[student._id].total) * 100).toFixed(2)}%`
            : '0%',
        }));

        // Sort the data by rollNo in increasing order
        calculatedData.sort((a, b) => a.rollNo - b.rollNo);

        setAttendanceData(calculatedData);

        // Find the maximum total classes
        const maxClasses = Math.max(...Object.values(studentsMap).map(data => data.total));
        setTotalClasses(maxClasses);

      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, [course, department, className, subject]);

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className='zxc'>
        <button className='back-btn' onClick={() => navigate("/TClass", { state: { user, course, department, className, subject } })}>Back</button>
       
        <div className='viewAttendance'>
          
        {!subject && (
          <div className="error-message" style={{marginLeft:"0px",fontWeight:"bold"}}>
            *Subject is not selected. Please select the subject.
          </div>
        )}
         <button
          className="takeAttendence-btn"
          style={{
            background: "#0C2D57",
            fontWeight: "bold",
          marginBottom:"40px"
          }}
          onClick={() =>
            navigate("/coursePlan", {
              state: { user, course, department, className, subject },
            })
          }
        >
          Course Plan
        </button>
          <h5>Attendance</h5>
          <div className='percentAttendance'>
            <table>
              <thead>
                <tr>
                  <th className='rollnoTh'>Roll No</th>
                  <th className='nameTh'>Name</th>
                  <th>Attendance Percentage</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((student, index) => (
                  <tr key={index}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td>{student.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='totalClasses'>
              <h4>Total Number of Classes: {totalClasses}</h4>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default ViewAttendance;
