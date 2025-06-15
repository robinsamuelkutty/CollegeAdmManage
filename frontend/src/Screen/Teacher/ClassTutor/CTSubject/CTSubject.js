import React, { useEffect, useState } from 'react';
import MNavBar from '../../../../Components/MNavBar/MNavBar';
import Footer from '../../../../Components/Footer/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from "../../../../images/titleLogo.png";
import axios from 'axios';

function CTSubject() {
  const [marks, setMarks] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [teacherName, setTeacherName] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate(); 
  const location = useLocation();
  const { user, course, department, className, subject } = location.state || {};

  useEffect(() => {
    const fetchMarksAndAttendance = async () => {
      try {
        if (subject.lab) {
          // Lab subject logic
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/marks`, {
            params: {
              className,
              department,
              course,
              subject,
              testName:"Lab"
            },
          });

          const sortedMarks = response.data.sort((a, b) => a.studentId.rollNo - b.studentId.rollNo);
          setMarks(sortedMarks);

          const attendanceResponse = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendance`, {
            params: {
              course,
              department,
              className,
              subjectId: subject._id,
            },
          });

          const studentAttendance = attendanceResponse.data;
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

          const studentIds = Object.keys(studentsMap);
          const studentDetailsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, {
            params: { studentIds },
          });

          const studentsDetails = studentDetailsResponse.data;

          const calculatedData = studentsDetails.map(student => {
            const attendancePercentage = studentsMap[student._id]
              ? (studentsMap[student._id].attended / studentsMap[student._id].total) * 100
              : 0;

            const attendanceMark = (attendancePercentage / 100) * 15;
            
            return {
                registerNo:student.registerNo,
              rollNo: student.rollNo,
              name: student.name,
              attendancePercentage: attendancePercentage.toFixed(2) + '%',
              attendanceMark: attendanceMark.toFixed(2),
              CEL:student.CEL,
              CAL:student.CAL,
              viva:student.viva
            };
          });
          console.log("student in lab",calculatedData)
          calculatedData.sort((a, b) => a.rollNo - b.rollNo);
          setAttendanceData(calculatedData);

          const maxClasses = Math.max(...Object.values(studentsMap).map(data => data.total));
          setTotalClasses(maxClasses);
        } else {
          // Non-lab subject logic
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/internalmarks`, {
            params: {
              className,
              department,
              course,
              subject,
            },
          });

          const aggregatedMarks = response.data.reduce((acc, mark) => {
            const studentKey = mark.rollNo;
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

            acc[studentKey].firstSeries += mark.firstSeries || 0;
            acc[studentKey].secondSeries += mark.secondSeries || 0;
            acc[studentKey].assignmentMark += mark.assignmentMark || 0;

            return acc;
          }, {});

          const calculatedMarks = Object.values(aggregatedMarks).map((mark) => {
            const seriesScore = (mark.firstSeries + mark.secondSeries) / 4;
            const internalMark = seriesScore + mark.assignmentMark + mark.attendanceMark;
            return { ...mark, seriesScore, internalMark };
          });

          const sortedMarks = calculatedMarks.sort((a, b) => a.rollNo - b.rollNo);
          setMarks(sortedMarks);

          const attendanceResponse = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendance`, {
            params: {
              course,
              department,
              className,
              subjectId: subject,
            },
          });

          const studentAttendance = attendanceResponse.data;
          const studentsMap = {};

          studentAttendance.forEach(record => {
            const { studentId } = record;

            if (!studentsMap[studentId]) {
              studentsMap[studentId] = { total: 0 };
            }

            studentsMap[studentId].total += 1;
          });

          const maxClasses = Math.max(...Object.values(studentsMap).map(data => data.total));
          setTotalClasses(maxClasses);
        }

        // Fetch the teacher's name using the subject ID
        const teacherResponse = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teacher-name`, {
          params: { subjectId: subject }
        });

        setTeacherName(teacherResponse.data.teacherName);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMarksAndAttendance();
  }, [className, department, course, subject]);

  const handleExport = () => {
    const input = document.querySelector('.percentAttendance');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
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
      default:
        return {
          testMark: 25,
          assignmentMark: 15,
          attendanceMark: 10,
          internalMark: 50
        };
    }
  };

  const { testMark, assignmentMark, attendanceMark, internalMark } = getMarkDistribution(course);

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className='zxc'>
        <button
          className='back-btn'
          onClick={() =>
            navigate('/selectSubjectTestCT', {
              state: { user, course, department, className },
            })
          }
        >
          Back
        </button>
        <div className='viewAttendance'>
          <p className='desktop-view-message'>For a better experience, please switch to desktop view.</p>
          <h5>Mark List</h5>
          <div className='percentAttendance' style={{ background: "white" }}>
            <div className='pdfHeader' style={{ overflowX: "hidden" }}>
              <div style={{ overflowX: "hidden", width: "450px", marginLeft: "30px" }}>
                <img style={{ height: "90px", float: "left", marginTop: "10px", marginRight: "5px" }} src={logo} alt='' />
                <h2 style={{ marginTop: "40px" }}>College of Engineering, Poonjar</h2>
              </div>
              <div>
                <h3 style={{ marginLeft: "80px" }}>{course} in {department}</h3>
                <h3 style={{ marginLeft: "20px" }}>Branch: Department of {department}</h3>
                <h5 style={{ marginTop: "10px" }}>{subject.subName}</h5>
              </div>
            </div>
            <h4>Faculty Name: {teacherName} </h4>
            <table>
              <thead>
                <tr>
                  <th className='verticalTh'>Register No</th>
                  <th className='verticalTh'>Roll No</th>
                  <th className='nameThv'>Name</th>
                  {subject.lab ? (
                    <>
                      <th className='verticalTh'>Attendance Percentage</th>
                      <th className='verticalTh'>Attendance Mark</th>
                    </>
                  ) : (
                    <>
                      <th className='verticalTh'>Test Mark<br/>({testMark})</th>
                      <th className='verticalTh'>Assignment  <br/>({assignmentMark})</th>
                      <th className='verticalTh'>Attendance <br/> ({attendanceMark})</th>
                      
                      <th className='verticalTh'>Internal Mark <br/>({internalMark})</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {subject.lab
                  ? attendanceData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.registerNo}</td>
                        <td>{data.rollNo}</td>
                        <td>{data.CEL}</td>
                        <td>{data.attendancePercentage}</td>
                        <td>{data.attendanceMark}</td>
                      </tr>
                    ))
                  : marks.map((mark, index) => (
                      <tr key={index}>
                        <td>{mark.registerNo}</td>
                        <td>{mark.rollNo}</td>
                        <td>{mark.name}</td>
                        <td>{mark.seriesScore.toFixed(2)}</td>  
                        <td>{mark.assignmentMark}</td>
                        <td>{mark.attendanceMark}</td>
                       
                        <td>{mark.internalMark.toFixed(2)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
            <h4>Total Number of Classes: {totalClasses}</h4>
          </div>
        </div>
        <button className='submit' onClick={handleExport}>Export</button>
      </div>
      <Footer />
    </>
  );
}

export default CTSubject;
