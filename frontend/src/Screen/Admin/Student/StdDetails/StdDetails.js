import React, { useState, useEffect } from 'react';
import Navbar from '../../../../Components/Navbar/Navbar';
import stdlogo from "../../../../images/student.png";
import { FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './StdDetail.css';

function StdDetails() {
  const location = useLocation();
  const { className, classId, departmentName, course } = location.state || { class: '', className: 'No Class Selected', classId: '', departmentName: '' };
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ rollNo: '',admissionYear:'', registerNo: '', name: '', password: '', classId: classId, class: className, department: departmentName });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingStudent, setEditingStudent] = useState({ rollNo: '', admissionYear:'',registerNo: '', name: '', password: '', classId: '', class: '', department: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, { params: { class: className, department: departmentName, course: course } });
        console.log("data", response.data)
        setStudents(response.data.sort((a, b) => parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10)));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    if (className && departmentName) {
      fetchStudents();
    }
    console.log("class", className, departmentName, course)
  }, [className, departmentName, course]);

  // Handlers for editing, saving, and deleting students
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, { ...newStudent });
      setStudents(prevStudents => [...prevStudents, response.data].sort((a, b) => parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10)));
      setNewStudent({ rollNo: '', admissionYear:'',registerNo: '', name: '', password: '', classId: classId, class: className, department: departmentName, course: course });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleEditStudent = (index) => {
    setEditingIndex(index);
    setEditingStudent(students[index]);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students/${students[editingIndex]._id}`, editingStudent);
      const updatedStudents = [...students];
      updatedStudents[editingIndex] = response.data;
      setStudents(updatedStudents.sort((a, b) => parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10)));
      setEditingIndex(null);
      setEditingStudent({ rollNo: '',admissionYear:'', registerNo: '', name: '', password: '', classId: '', class: '', department: '' });
    } catch (error) {
      console.error('Error editing student:', error);
    }
  };

  const handleDeleteStudent = async (index) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students/${students[index]._id}`);
      setStudents(prevStudents => prevStudents.filter((_, i) => i !== index).sort((a, b) => parseInt(a.rollNo, 10) - parseInt(b.rollNo, 10)));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  // Modal handling functions
  const openModal = () => {
    setIsModalOpen(true);
    // Set initial values for new student based on selected class and department
    setNewStudent(prevStudent => ({
      ...prevStudent,
      classId: classId,
      class: className,
      department: departmentName,
      course: course
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewStudent({ rollNo: '',admissionYear:'', registerNo: '', name: '', password: '', classId: classId, class: className, department: departmentName, course: course });
  };

  return (
    <>
      <Navbar />
      <div className='Students-Details'>
        <h2 className='cls'>{className}</h2>
        <div className='StdDetailsTable'>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Register No</th>
                <th>Admission Year</th>
                <th>Name</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  {editingIndex === index ? (
                    <>
                      <td><input type="text" value={editingStudent.rollNo} onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: e.target.value })} /></td>
                      <td><input type="text" value={editingStudent.registerNo} onChange={(e) => setEditingStudent({ ...editingStudent, registerNo: e.target.value })} /></td>
                      <td><input type="text" value={editingStudent.admissionYear} onChange={(e) => setEditingStudent({ ...editingStudent, admissionYear: e.target.value })} /></td>
                      <td><input type="text" value={editingStudent.name} onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })} /></td>
                      <td><input type="text" value={editingStudent.password} onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })} /></td>
                      <td><button onClick={handleSaveEdit} className="addc-btn">Save</button></td>
                    </>
                  ) : (
                    <>
                      <td>{student.rollNo}</td>
                      <td>{student.registerNo}</td>
                      <td>{student.admissionYear}</td>
                      <td>{student.name}</td>
                      <td>{student.password}</td>
                      <td>
                        <button onClick={() => handleEditStudent(index)} className='editc-btn'>Edit</button>
                        <button onClick={() => handleDeleteStudent(index)} className='dltc-btn'>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button className="btn" onClick={openModal}>
              <img className="studlogo" src={stdlogo} alt="" /> Add Student
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}><FaTimes /></button>
            <h3>Add New Student</h3>
            <form onSubmit={handleAddStudent} className="add-student-form">
              <label>
                Roll No:
                <input
                  type="text"
                  placeholder="Roll No"
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                />
              </label>
              <label>
                Register No:
                <input
                  type="text"
                  placeholder="Register No"
                  value={newStudent.registerNo}
                  onChange={(e) => setNewStudent({ ...newStudent, registerNo: e.target.value })}
                />
              </label>
              <label>
                Admission Year:
                <input
                  type="text"
                  placeholder="Admission Year"
                  value={newStudent.admissionYear}
                  onChange={(e) => setNewStudent({ ...newStudent, admissionYear: e.target.value })}
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  placeholder="Name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </label>
              <label>
                Password:
                <input
                  type="text"
                  placeholder="Password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                />
              </label>
              <button type="submit" className="add-btn">Add </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default StdDetails;
