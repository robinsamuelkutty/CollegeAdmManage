import React, { useEffect, useState } from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import stdlogo from "../../../images/student.png";
import tecLogo from "../../../images/teacher.png";
import { useNavigate ,useLocation} from "react-router-dom";
import axios from 'axios';
import CountUp from 'react-countup';
import "./Home.css";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const adminData = location.state?.admin || JSON.parse(localStorage.getItem('adminData'));

  useEffect(() => {
    // Fetch student count
    axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students/count`) // Adjust the URL if needed
      .then(response => setStudentCount(response.data.count))
      .catch(error => console.error('Error fetching student count:', error));

    // Fetch teacher count
    axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/count`) // Adjust the URL if needed
      .then(response => setTeacherCount(response.data.count))
      .catch(error => console.error('Error fetching teacher count:', error));
  }, []);

  return (
    <>
      <Navbar admin={adminData}/>
      <div className='Home'>
        <div className='Numbers-count'>
          <h2>Total No. of Students:</h2>
          <h5>
            <CountUp end={studentCount} duration={2.5} separator="," />
          </h5>
        </div>
        <div>
          <button className="btn" onClick={() => navigate("/addstudent")}>
            <img className="stdlogo" src={stdlogo} alt="" /> Add Student
          </button>
        </div>
        <div className='Numbers-count'>
          <h2>Total No. of Teachers:</h2>
          <h5>
            <CountUp end={teacherCount} duration={2.5} separator="," />
          </h5>
        </div>
        <div>
          <button className="btn" onClick={() => navigate("/addteacher")}>
            <img className="stdlogo" src={tecLogo} alt="" /> Add Teacher
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;
