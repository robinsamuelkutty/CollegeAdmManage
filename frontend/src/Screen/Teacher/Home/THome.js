import React, { useEffect, useState } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import "./THome.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';
function THome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course, department } = location.state || {};
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

  // Filter subjects based on the selected course and department
  const filteredSubjects = subjects.filter(subject => subject.course === course && subject.department === department);
console.log("subjects from THOme",subjects)
  // Extract unique class names from filtered subjects
  const uniqueClasses = [...new Set(filteredSubjects.map(subject => subject.className))];

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className="zxc">
        <button className='back-btn' onClick={() => navigate("/selectDept", { state: { user, course, department } })}>Back</button>
      </div>
      <div className='teacherHome'>
        <h5>Select Class</h5>
        <div className='selectCls'>
          {uniqueClasses.map((className, index) => (
            <div key={index} className='card' onClick={() => navigate("/Tclass", { state: { user, course, department, className,subjects } })} style={{float:"left"}}>
              <h4>{className}</h4>
            </div>
          ))}
        </div>
      </div>
       <Footer/>
    </>
  );
}

export default THome;
