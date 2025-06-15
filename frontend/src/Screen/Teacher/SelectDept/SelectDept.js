import React, { useEffect, useState } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import "../Home/THome.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function SelectDept() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course } = location.state || {};
  console.log("user:", user);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (user?.teacher?._id) {
      // Fetch subjects based on teacher's ID
      axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/${user.teacher._id}/subjects`)
        .then(response => {
          setSubjects(response.data);
        })
        .catch(error => {
          console.error('Error fetching subjects:', error);
        });
    }
  }, [user]);

  // Filter subjects based on the selected course
  const filteredSubjects = subjects.filter(subject => subject.course === course);

  // Extract unique departments from filtered subjects
  const uniqueDepartments = [...new Set(filteredSubjects.map(subject => subject.department))];

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className="zxc">
        <button className='back-btn' onClick={() => navigate("/teacher", { state: { user } })}>Back</button>
      </div>
      <div className='teacherHome'>
        <h5>Select Department</h5>
        <div className='selectCls'>
          {uniqueDepartments.map((department, index) => (
            <div key={index} className='card' onClick={() => navigate("/selectClass", { state: { user, course, department } })} style={{float:"left"}}>
              <h6>{department}</h6>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default SelectDept;
