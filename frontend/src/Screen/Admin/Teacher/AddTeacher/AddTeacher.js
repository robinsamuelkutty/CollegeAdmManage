import React, { useState } from 'react';
import Navbar from '../../../../Components/Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Student/AddStudent/AddStudent.css'
import Footer from '../../../../Components/Footer/Footer';

function AddTeacher() {
  const [newTeacher, setNewTeacher] = useState({
    userId: '',
    name: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/teachers', newTeacher); // Updated endpoint
      console.log(response.data);
      setNewTeacher({
        userId: '',
        name: '',
        password: ''
      });
      setError(''); // Clear any existing errors
      setSuccessMessage('Teacher added successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Clear success message after a few seconds
      }, 3000);
      navigate("/addteacher"); 
    } catch (err) {
      console.error('Error creating teacher:', err);
      setError('Error creating teacher. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <>
      <Navbar />
      <div className='addTeac'>
        <div className='add-student'>
          <h2>Add Teacher</h2>
          
          <form className='student-form' onSubmit={handleSave}>
            <div className='form-group'>
              <label htmlFor='userId'>User ID</label>
              <input
                type="text"
                id="userId"
                name="userId"
                placeholder="User ID"
                value={newTeacher.userId}
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
                value={newTeacher.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={newTeacher.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type='submit'>Submit</button>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddTeacher;

