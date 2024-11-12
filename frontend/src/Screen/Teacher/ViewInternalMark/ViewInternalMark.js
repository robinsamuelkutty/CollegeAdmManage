import React, { useState, useEffect } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import '../ViewAttendance/viewAttendance.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

import logo from "../../../images/titleLogo.png";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function ViewInternalMark() {
  const [marks, setMarks] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const navigate = useNavigate(); 
  const location = useLocation();
  const { user, course, department, className, subject } = location.state || {};

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        // Fetch internal marks for the subject
        const response = await axios.get('/api/internalmarks', {
          params: {
            className,
            department,
            course,
            subject,
          },
        });

        // Aggregate marks by student
        const aggregatedMarks = response.data.reduce((acc, mark) => {
          const studentKey = mark.rollNo; // Use roll number as the key
          if (!acc[studentKey]) {
            acc[studentKey] = {
              registerNo: mark.registerNo,
              rollNo: mark.rollNo,
              name: mark.name,
              firstSeries: 0,
              secondSeries: 0,
              assignmentMark: 0,
              attendanceMark: mark.attendanceMark || 0,
              attendancePercentage: mark.attendancePercentage,
            };
          }

          // Add scores based on test type
          acc[studentKey].firstSeries += mark.firstSeries || 0;
          acc[studentKey].secondSeries += mark.secondSeries || 0;
          acc[studentKey].assignmentMark += mark.assignmentMark || 0;

          return acc;
        }, {});

        // Convert aggregated marks object to an array
        const calculatedMarks = Object.values(aggregatedMarks).map((mark) => {
          const seriesScore = (mark.firstSeries + mark.secondSeries) / 4;
          const internalMark = seriesScore + mark.assignmentMark + mark.attendanceMark;
          return { ...mark,seriesScore, internalMark };
        });

        // Sort the marks based on rollNo in ascending order
        const sortedMarks = calculatedMarks.sort((a, b) => a.rollNo - b.rollNo);

        setMarks(sortedMarks);

        // Fetch attendance records to get total classes
        const attendanceResponse = await axios.get('/api/attendance', {
          params: {
            course,
            department,
            className,
            subjectId: subject,
          }
        });

        const studentAttendance = attendanceResponse.data;

        // Create a map to store attendance details for each student
        const studentsMap = {};

        studentAttendance.forEach(record => {
          const { studentId } = record;

          if (!studentsMap[studentId]) {
            studentsMap[studentId] = { total: 0 };
          }

          studentsMap[studentId].total += 1;
        });

        // Find the maximum total classes
        const maxClasses = Math.max(...Object.values(studentsMap).map(data => data.total));
        setTotalClasses(maxClasses);

      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };

    fetchMarks();
  }, [className, department, course, subject]);

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
        pdf.save(`Internal Marks-${className}-${course}.pdf`);
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  // Function to get the marks distribution based on the course
  const getMarkDistribution = (course) => {
    switch (course) {
      case "MCA":
        return {
          testMark: 20,
          assignmentMark: 12,
          attendanceMark: 8,
          internalMark: 40
        };
      case "Diploma":
        return {
          testMark: 20,
          assignmentMark: 20,
          attendanceMark: 10,
          internalMark: 50
        };
      default: // Default is "BTech"
        return {
          testMark: 25,
          assignmentMark: 15,
          attendanceMark: 10,
          internalMark: 50
        };
    }
  };

  // Get the current mark distribution for the course
  const { testMark, assignmentMark, attendanceMark, internalMark } = getMarkDistribution(course);

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className='zxc'>
        <button
          className='back-btn'
          onClick={() =>
            navigate('selectTestforMark', {
              state: { user, course, department, className, subject },
            })
          }
        >
          Back
        </button>
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
                <h3 style={{marginLeft:"20px"}}>Branch: Department of {department}</h3>
                <h5 style={{marginTop:"10px"}}>{subject.subName}</h5>
              </div>
            </div>
            <h4>Faculty Name: {user.teacher.name} </h4>
          
            <table>
              <thead>
                <tr>
                  <th className='verticalTh'>Register No</th>
                  <th className='verticalTh'>Roll No</th>
                  <th className='nameThv'>Name</th>
                  
                  <th className='verticalTh'>Test Mark<br/>({testMark})</th>
                  <th className='verticalTh'>Assignment<br/>({assignmentMark})</th>
                  <th className='verticalTh'>Attendance<br/>({attendanceMark})</th>
                  <th className='verticalTh'>Internal Mark<br/>({internalMark})</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, index) => (
                  <tr key={index}>
                    <td>{mark.registerNo}</td>
                    <td>{mark.rollNo}</td>
                    <td>{mark.name}</td>
                  
                    <td>{mark.seriesScore}</td>
                    <td>{mark.assignmentMark}</td>
                    <td>{mark.attendanceMark}</td>
                    <td>{mark.internalMark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='total-classes'>
              <h4>Total Number of Classes: {totalClasses}</h4>
            </div>
          </div>
          <button style={{marginTop:"20px"}} className='save-btn' onClick={handleExport}>Export</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ViewInternalMark;
