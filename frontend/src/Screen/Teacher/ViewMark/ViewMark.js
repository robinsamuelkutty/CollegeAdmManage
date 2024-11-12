import React, { useState, useEffect } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import '../ViewAttendance/viewAttendance.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function ViewMark() {
  const [marks, setMarks] = useState([]);
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
      } catch (error) {
        console.error('Error fetching marks:', error);
      }
    };

    fetchMarks();
  }, [className, department, course, subject, testName]);

  console.log("view marks GET", className, department, course, subject.subName, testName);

  return (
    <>
      <MNavBar user={user.teacher}/>
      <div className='zxc'>
        <button className='back-btn' onClick={() => navigate("/selectTestforMark", { state: { user, course, department, className, subject } })}>Back</button>
        <div className='viewAttendance'>
          <h5>Mark List</h5>
          <div className='percentAttendance'>
            <table>
              <thead>
                <tr>
                <th className='rollnoTh'>Roll No</th>
                <th className='nameTh'>Name</th>
                <th className='viewMarkTh'>Mark</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, index) => (
                  <tr key={index}>
                    <td>{mark.studentId.rollNo}</td>
                    <td>{mark.studentId.name}</td>
                    <td>{mark.mark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default ViewMark;
