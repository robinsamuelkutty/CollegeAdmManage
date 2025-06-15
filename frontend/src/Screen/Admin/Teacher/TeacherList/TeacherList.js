import React, { useState, useEffect } from 'react';
import Navbar from '../../../../Components/Navbar/Navbar';
import axios from 'axios';
import '../../Student/StdDetails/StdDetail.css'
import Footer from '../../../../Components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState({ userId: '', name: '', password: '' });
  const navigate=useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers`);
        console.log("data", response.data);
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleEditTeacher = (index) => {
    setEditingIndex(index);
    setEditingTeacher(teachers[index]);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/${teachers[editingIndex]._id}`, editingTeacher);
      const updatedTeachers = [...teachers];
      updatedTeachers[editingIndex] = response.data;
      setTeachers(updatedTeachers);
      setEditingIndex(null);
      setEditingTeacher({ userId: '', name: '', password: '' });
    } catch (error) {
      console.error('Error editing teacher:', error);
    }
  };

  const handleDeleteTeacher = async (index) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/${teachers[index]._id}`);
      setTeachers(prevTeachers => prevTeachers.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='Students-Details'>
        <h2 className='cls'>Teachers List</h2>
        <div className='StdDetailsTable'>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={index}>
                  {editingIndex === index ? (
                    <>
                      <td><input type="text" value={editingTeacher.userId} onChange={(e) => setEditingTeacher({ ...editingTeacher, userId: e.target.value })} /></td>
                      <td><input type="text" value={editingTeacher.name} onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })} /></td>
                      <td><input type="text" value={editingTeacher.password} onChange={(e) => setEditingTeacher({ ...editingTeacher, password: e.target.value })} /></td>
                      <td><button onClick={handleSaveEdit} className="addc-btn">Save</button></td>
                    </>
                  ) : (
                    <>
                      <td>{teacher.userId}</td>
                      <td>{teacher.name}</td>
                      <td>{teacher.password}</td>
                      <td>
                        <button onClick={() => handleEditTeacher(index)} className='editc-btn'>Edit</button>
                        <button onClick={() => handleDeleteTeacher(index)} className='dltc-btn'>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className="btn" onClick={()=>navigate("/course")}>Go to Classes</button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default TeacherList;
