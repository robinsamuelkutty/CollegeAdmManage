import React, { useEffect, useState } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function LabInternalMark() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, testName } = location.state || {};
  const [subjectMarks, setSubjectMarks] = useState([]);

  useEffect(() => {
    const fetchMarks = async () => {
      if (user && user.student) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/studentlabinternalmark`, {
            params: {
              studentId: user.student._id, // Send the studentId
            },
          });
          
          // Filter the subjects to include only those with lab: true
          const labMarks = response.data.filter(mark => mark.subject.lab === true);
          console.log("labmard",response.data)
          setSubjectMarks(labMarks);
        } catch (error) {
          console.error('Error fetching marks:', error);
        }
      }
    };

    fetchMarks();
  }, [user, testName]);

  return (
    <>
      <MNavBar user={user.student} />
      <div className='zxc'>
        <button className='back-btn' onClick={() => navigate("/selectTestStudent", { state: { user } })}>Back</button>
        <div className='viewAttendance'>
          <h5>Mark Sheet for Lab Internal Mark</h5>
          <div className='percentAttendance'>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                {subjectMarks.map((mark, index) => (
                  <tr key={index}>
                    <td>{mark.subject.subName}</td>
                    <td>{mark.internalMark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LabInternalMark;
