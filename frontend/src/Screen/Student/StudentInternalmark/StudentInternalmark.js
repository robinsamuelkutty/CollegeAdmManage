import React, { useEffect, useState } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function StudentInternalMark() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};
  const [subjectMarks, setSubjectMarks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      if (user && user.student) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/studentinternalmark`, {
            params: {
              studentId: user.student._id,
            },
          });
          setSubjectMarks(response.data);
        } catch (error) {
          console.error('Error fetching marks:', error);
          setError('Failed to fetch marks. Please try again later.');
        }
      }
    };

    fetchMarks();
  }, [user]);

  return (
    <>
      <MNavBar user={user.student} />
      <div className='zxc'>
        <button className='back-btn' onClick={() => navigate("/selectTestStudent", { state: { user } })}>Back</button>
        <div className='viewAttendance'>
          <h5>Mark Sheet</h5>
          {error ? (
            <p>{error}</p>
          ) : (
            <div className='percentAttendance'>
              {subjectMarks.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th style={{width:"200px"}}>Subject</th>
                      <th className='verticalTh'>1st Series</th>
                      <th className='verticalTh'>2nd Series</th>
                      <th className='verticalTh'>Assignment</th>
                      <th className='verticalTh'>Attendance</th>
                      <th className='verticalTh'>Internal Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectMarks
                      .filter(mark => !mark.subject.lab) // Exclude lab subjects
                      .map((mark, index) => (
                        <tr key={index}>
                          <td>{mark.subject.subName}</td>
                          <td>{mark.firstSeries}</td>
                          <td>{mark.secondSeries}</td>
                          <td>{mark.assignmentMark}</td>
                          <td>{mark.attendancePercentage.toFixed(2)}%</td>
                          <td>{mark.internalMark}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p>No marks available.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default StudentInternalMark;
