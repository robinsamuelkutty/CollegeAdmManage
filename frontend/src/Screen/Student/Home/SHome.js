import React, { useState, useEffect } from 'react';
import "../../Teacher/TClass/TClass.css";
import MNavBar from '../../../Components/MNavBar/MNavBar';
import { useNavigate } from 'react-router-dom';
import attendance from "../../../images/attendance.png";
import mark from "../../../images/grade.png";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';


function SHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`/api/students/${user.registerNo}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    if (user && user.registerNo) {
      fetchStudentDetails();
    }
  }, [user]);
  console.log("userName",user)
  console.log(student)

  return (
    <>
      <MNavBar user={user.student} />
      
      <div className="TClass">
        <h7>{user.student.class}-{user.student.course}</h7> 
        
        <div className="tercards">
          <div className="cardt" onClick={() => navigate("/student-Attendance", { state: { user } })}>
            <img className="att-mark" src={attendance} alt="" />
            <h3>Attendance</h3>
          </div>
          <div className="cardt" onClick={() => navigate("/selectTestStudent", { state: { user } })}>
            <img className="att-mark" src={mark} alt="" />
            <h3>Mark</h3>
          </div>
        </div>
      </div>
      <Footer/>
      
    </>
  );
}

export default SHome;

