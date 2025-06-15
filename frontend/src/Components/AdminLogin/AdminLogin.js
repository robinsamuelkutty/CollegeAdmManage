import React, { useState } from 'react';
import './AdminLogin.css';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("ENV Backend URL:", process.env.REACT_APP_BACKEND_BASEURL);

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/admin/login`, { username, password });
      const { data } = response;
      if (response.data.success) {
        // Save admin data to localStorage
        localStorage.setItem('adminData', JSON.stringify(data));
        navigate('/adminHome', { state: { admin: data } });
      }
    } catch (error) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        
        <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
          <div className="input-group">
          <FaUser />
            <div className="input-icon">
              
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                
              />
            </div>
          </div>
          <label htmlFor="password">Password</label>
          <div className="input-group">
          <FaLock />
            <div className="input-icon">
             
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button className="adminLogin-btn" type="submit">Login</button>
        </form>
        {error && <div className="erroradmin-message">{error}</div>}
      </div>
    </div>
  );
}

export default AdminLogin;
