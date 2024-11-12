import React, { useEffect, useState } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import "../Home/THome.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function SelectCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};
  console.log("user:", user);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (user?.teacher?._id) {
      // Fetch subjects based on teacher's ID
      axios.get(`/api/teachers/${user.teacher._id}/subjects`)
        .then(response => {
          console.log("teache in the select course",response.data)
          setSubjects(response.data);
        })
        .catch(error => {
          console.error('Error fetching subjects:', error);
        });
    }
  }, [user]);

  // Extract unique courses
  const uniqueCourses = [...new Set(subjects.map(subject => subject.course))];

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className='teacherHome'>
        <h5>Select Course</h5>
        <div className='selectCls'>
          {uniqueCourses.map((course, index) => (
            <div key={index} className='card' onClick={() => navigate("/selectDept", { state: { user, course } })} style={{float:"left"}}>
              <h4>{course}</h4>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default SelectCourse;
