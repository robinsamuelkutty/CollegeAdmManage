import React, { useState, useEffect } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import '../ViewAttendance/viewAttendance.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';
import logo from "../../../images/titleLogo.png"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ViewLabInternalMark() {
  const [marks, setMarks] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course, department, className, subject, testName } = location.state || {};

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const response = await axios.get('/api/marks', {
          params: {
            className,
            department,
            course,
            subject,
            testName,
          },
        });

        // Sort the marks based on rollNo in ascending order
        const sortedMarks = response.data.sort((a, b) => a.studentId.rollNo - b.studentId.rollNo);
        setMarks(sortedMarks);

        // Fetch attendance records for the subject
        const attendanceResponse = await axios.get('/api/attendance', {
          params: {
            course,
            department,
            className,
            subjectId: subject._id,
          }
        });

        const studentAttendance = attendanceResponse.data;

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

        // Fetch student details to get names and roll numbers
        const studentIds = Object.keys(studentsMap);
        const studentDetailsResponse = await axios.get('/api/students', {
          params: {
            studentIds,
          }
        });

        const studentsDetails = studentDetailsResponse.data;

        // Calculate attendance percentage, attendance mark, and prepare data for display
        const calculatedData = studentsDetails.map(student => {
          const attendancePercentage = studentsMap[student._id]
            ? (studentsMap[student._id].attended / studentsMap[student._id].total) * 100
            : 0;

          const attendanceMark = (attendancePercentage / 100) * 15;

          return {
            rollNo: student.rollNo,
            name: student.name,
            attendancePercentage: attendancePercentage.toFixed(2) + '%',
            attendanceMark: attendanceMark.toFixed(2),
          };
        });

        // Sort the data by rollNo in ascending order
        calculatedData.sort((a, b) => a.rollNo - b.rollNo);

        setAttendanceData(calculatedData);
        // Fetch attendance records to get total classes
        const attendanceReport = await axios.get('/api/attendance', {
          params: {
            course,
            department,
            className,
            subjectId: subject,
          }
        });

        const oneStudentAttendance = attendanceReport.data;

        // Create a map to store attendance details for each student
        const studentMap = {};

        oneStudentAttendance.forEach(record => {
          const { studentId } = record;

          if (!studentMap[studentId]) {
            studentMap[studentId] = { total: 0 };
          }

          studentMap[studentId].total += 1;
        });

        // Find the maximum total classes
        const maxClasses = Math.max(...Object.values(studentMap).map(data => data.total));
        setTotalClasses(maxClasses);

      } catch (error) {
        console.error('Error fetching marks or attendance:', error);
      }
    };

    fetchMarks();
  }, [className, department, course, subject, testName]);
  const handleExport = () => {
    const input = document.querySelector('.percentAttendance'); // The div you want to export
  
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate the dimensions and scale
        const pdf = new jsPDF('p', 'mm', 'a4'); // Set format to A4
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;
  
        pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
        pdf.save(`Lab Internal Marks-${className}-${course}.pdf`);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };
  
  return (
    <>
      <MNavBar user={user.teacher}/>
      <div className='zxc'>
        <button className='back-btn' onClick={() => navigate("/selectTestforMark", { state: { user, course, department, className, subject } })}>Back</button>
        <div className='viewAttendance'>
        <p className='desktop-view-message'>For a better experience, please switch to desktop view.</p>
          <h5>Mark List</h5>
          <div className='percentAttendance' style={{background:"white"}}>
          <div className='pdfHeader' style={{  overflowX: "hidden"}}>
            <div style={{  overflowX: "hidden",width:"450px",marginLeft:"30px"}}>
              <img style={{height:"90px",float:"left", marginTop:"10px",marginRight:"5px"}} src={logo} alt=''/>
              <h2 style={{marginTop:"40px"}}>College of Engineering, Poonjar</h2>
              </div>
              <div>
              <h3 style={{marginLeft:"80px"}}>{course} in {department}</h3>
              <h5 style={{marginTop:"10px"}}>{subject.subName}</h5>
              </div>
           </div>
           <h4 >Faculty Name: {user.teacher.name} </h4>
            <table>
              <thead>
                <tr>
                  <th>Register No</th>
                  <th className='rollnoTh'>Roll No</th>
                  <th className='nameTh'>Name</th>
                  <th>Attendance </th>
                  
                  <th className="celTh">
                    <span>Continuous <br/>Evaluation in <br/>Lab</span>
                  </th>
                  <th className="catTh">
                    <span>
                      Continuous <br/>Assessment <br />
                      Test
                    </span>
                  </th>
                  <th>Viva-voce</th>
                  <th>Internal<br/> Mark</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, index) => {
                  const attendance = attendanceData.find(att => att.rollNo === mark.studentId.rollNo);
                  const attendanceMark = attendance ? parseFloat(attendance.attendanceMark) : 0;
                  const internalMark = attendanceMark + mark.CEL + mark.CAT + mark.viva;

                  return (
                    <tr key={index}>
                      <td>{mark.studentId.registerNo}</td>
                      <td>{mark.studentId.rollNo}</td>
                      <td>{mark.studentId.name}</td>
                      <td>{attendance?.attendanceMark || '0%'}</td>
                      
                      <td>{mark.CEL}</td>
                      <td>{mark.CAT}</td>
                      <td>{mark.viva}</td>
                      <td>{internalMark.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className='total-classes'>
              <h4>Total Number of Classes: {totalClasses}</h4>
            </div>
          </div>
          <button  style={{marginTop:"20px"}} className='save-btn' onClick={handleExport}>Export</button>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default ViewLabInternalMark;
