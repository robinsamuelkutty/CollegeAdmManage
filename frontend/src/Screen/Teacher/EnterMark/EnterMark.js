import React, { useState, useEffect } from 'react';
import './EnterMark.css';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function EnterMark() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course, department, className, subject, testName } = location.state || {};
  
  const [marks, setMarks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newMark, setNewMark] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, {
          params: { class: className, department, course }
        });
        
        // Sort students by rollNo
        const sortedStudents = response.data.sort((a, b) => a.rollNo - b.rollNo);

        setMarks(sortedStudents.map(student => ({
          ...student,
          mark: ''
        })));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [className, department, course]);

  const handleEdit = (index) => {
    setEditing(index);
    setNewMark(marks[index].mark);
  };

  const handleSave = (index) => {
    const updatedMarks = [...marks];
    updatedMarks[index].mark = newMark;
    setMarks(updatedMarks);
    setEditing(null);
    setNewMark('');
  };

  const handleChange = (event) => {
    setNewMark(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      for (const student of marks) {
        console.log("testing", student.mark,
          testName,
          subject,
          user.teacher._id )
        if (student.mark) {
          await axios.put(`${process.env.REACT_APP_BACKEND_BASEURL}/api/marks/${student._id}`, {
            mark: student.mark,
            testName,
            subject,
            teacherId: user.teacher._id // Ensure teacherId is sent
          });
        }
      }
      navigate("/selectSeriesT", { state: { user, course, department, className, subject } });
    } catch (error) {
      console.error('Error updating student marks:', error);
    }
  };

  return (
    <>
      <MNavBar user={user.teacher}/>
      <div className='enterMark'>
        <h5>Enter Mark for {testName}</h5>
        <div className='markTable'>
          <table>
            <thead>
              <tr>
                <th className='rollnoTh'>Roll No</th>
                <th className='nameTh'>Name</th>
                <th>Mark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((student, index) => (
                <tr key={student._id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>
                    {editing === index ? (
                      <input
                        type='text'
                        value={newMark}
                        onChange={handleChange}
                      />
                    ) : (
                      student.mark
                    )}
                  </td>
                  <td>
                    {editing === index ? (
                      <button onClick={() => handleSave(index)}>Save</button>
                    ) : (
                      <button onClick={() => handleEdit(index)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" className="takeAttendence-btn" onClick={handleSubmit}>
          Add Mark
        </button>
      </div>
      <Footer/>
    </>
  );
}

export default EnterMark;
