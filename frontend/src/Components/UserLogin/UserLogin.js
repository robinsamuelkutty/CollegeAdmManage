import React, { useState } from 'react';
import loginLogo from '../../images/logo.png';
import { FaUser, FaLock } from 'react-icons/fa';
import './UserLogin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserLogin() {
  const [activeUser, setActiveUser] = useState('student');
  const [credentials, setCredentials] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUserChange = (user) => {
    setActiveUser(user);
    setCredentials({ userId: '', password: '' }); // Reset credentials when changing user type
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, password } = credentials;

    try {
      const endpoint = activeUser === 'student' ? '/api/students/login' : '/api/teachers/login';
      const response = await axios.post(endpoint, { userId, password });
      const { data } = response;

      if (activeUser === 'student') {
        navigate('/student', { state: { user: data } });
      } else {
        navigate('/teacher', { state: { user: data } });
      }
    } catch (err) {
      setError('*Invalid Username and Password*');
    }
  };

  return (
    <div className="user-login-container">
      <div className="login-card">
        <img src={loginLogo} alt="Logo" className="Loginlogo" />
        <div className="user-options">
          <button
            className={`user-option ${activeUser === 'student' ? 'active' : ''}`}
            onClick={() => handleUserChange('student')}
          >
            Student
          </button>
          <button
            className={`user-option ${activeUser === 'faculty' ? 'active' : ''}`}
            onClick={() => handleUserChange('faculty')}
          >
            Faculty
          </button>
        </div>
        <div className="login-forms">
          {activeUser === 'student' && (
            <div className="form-content">
              <h3>Student Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    name="userId"
                    value={credentials.userId}
                    placeholder="Register No"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <FaLock className="icon" />
                  <input
                    type="text"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
            </div>
          )}
          {activeUser === 'faculty' && (
            <div className="form-content">
              <h3>Faculty Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    name="userId"
                    value={credentials.userId}
                    placeholder="User ID"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <FaLock className="icon" />
                  <input
                    type="text"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
            </div>
          )}
        </div>
        {error && <p className="error" style={{color:"red"}}>{error}</p>}
      </div>
    </div>
  );
}

export default UserLogin;
