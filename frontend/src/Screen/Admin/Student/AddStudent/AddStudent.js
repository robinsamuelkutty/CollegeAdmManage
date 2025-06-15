import React, { useState } from 'react';
import Navbar from '../../../../Components/Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddStudent.css';
import Footer from '../../../../Components/Footer/Footer';

function AddStud() {
  const [newStudent, setNewStudent] = useState({
    yearScheme:'',
    admissionYear: '',
    registerNo: '',
    rollNo: '',
    name: '',
    course: '',
    department: '',
    class: '',
    password: ''
  });

  const [departments, setDepartments] = useState([]); // State to store departments
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });

    if (name === 'course') {
      fetchDepartments(value); // Fetch departments when course changes
    }
  };

  const fetchDepartments = async (course) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/departments?course=${course}`);
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartments([]); // Clear departments if there's an error
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, newStudent);
      console.log(response.data);
      setNewStudent({
        yearScheme:'',
        admissionYear: '',
        registerNo: '',
        rollNo: '',
        name: '',
        course: '',
        department: '',
        class: '',
        password: ''
      });
      setError(''); // Clear any existing errors
      navigate("/adminHome"); // Redirect to admin home or any other page
    } catch (err) {
      console.error('Error creating student:', err);
      setError('Error creating student. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className='addStud'>
        <div className='add-student'>
          <h2>Add Student</h2>

          <form className='student-form' onSubmit={handleSave}>
          <div className='form-group'>
              <label htmlFor="course">Scheme</label>
              <select
                id="yearScheme"
                name="yearScheme"
                value={newStudent.yearScheme}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Scheme</option>
                <option value="2019 Scheme">2019 Scheme</option>
                <option value="2024 Scheme">2024 Schema</option>
                
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='registerNo'>Register No</label>
              <input
                type="text"
                id="registerNo"
                name="registerNo"
                placeholder="Register No"
                value={newStudent.registerNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='admissionYear'>Admission Year</label>
              <input
                type="text"
                id="admissionYear"
                name="admissionYear"
                placeholder="Admission Year"
                value={newStudent.admissionYear}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={newStudent.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='rollNo'>Roll No</label>
              <input
                type="text"
                id="rollNo"
                name="rollNo"
                placeholder="Roll No"
                value={newStudent.rollNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='class'>Semester</label>
              <input
                type="text"
                id="class"
                name="class"
                placeholder="Semester"
                value={newStudent.class}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor="course">Course</label>
              <select
                id="course"
                name="course"
                value={newStudent.course}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Course</option>
                <option value="BTech">BTech</option>
                <option value="Diploma">Diploma</option>
                <option value="MCA">MCA</option>
                <option value="BCA">BCA</option>
                <option value="BBA">BBA</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='department'>Department</label>
              <select
                id="department"
                name="department"
                value={newStudent.department}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Department</option>
                {departments.map(department => (
                  <option key={department._id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={newStudent.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type='submit'>Submit</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddStud;
