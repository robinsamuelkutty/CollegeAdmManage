import React, { useState, useEffect } from "react";
import MNavBar from "../../../Components/MNavBar/MNavBar";
import attendance from "../../../images/attendance.png";
import mark from "../../../images/grade.png";
import './TClass.css';
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../../Components/Footer/Footer";
import axios from 'axios';
axios.defaults.baseURL = '${process.env.REACT_APP_BACKEND_BASEURL}';

function TCLass() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course, department, className, subjects, subject: singleSubject } = location.state || {};
  
  const [classes, setClasses] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(() => {
    if (Array.isArray(subjects) && subjects.length === 1) {
      return subjects[0]; // Directly set the only available subject
    } else if (singleSubject) {
      return singleSubject;
    }
    return null;
  });
  const [selectedRole, setSelectedRole] = useState("Faculty");

  // Fetch classes for the teacher on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      if (!user || !user.teacher || !user.teacher._id) {
        console.error("Teacher ID is missing");
        return;
      }
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/${user.teacher._id}/classes`);
        setClasses(response.data);
        console.log("Classes fetched:", response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
  
    fetchClasses();
  }, [user]);

  const handleSubjectChange = (event) => {
    const selectedSub = subjects.find(sub => sub.subName === event.target.value);
    setSelectedSubject(selectedSub);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    if (event.target.value === "Faculty") {
      navigate("/TClass", { state: { user, course, department, className, subjects, subject: selectedSubject } });
    } else if (event.target.value === "Class Tutor") {
      navigate("/classTutorHome", { state: { user, course, department, className, subjects, subject: selectedSubject } });
    }
  };

  // Check if the user is a tutor in the selected class
  const isTutor = classes.some(cls => cls.className.name === className && cls.department.name === department && cls.tutor);

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className="zxc">
        <button className='back-btn' onClick={() => navigate("/selectClass", { state: { user, course, department } })}>Back</button>
      </div>
      <div
        className="zxc"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        {isTutor && (
          <div className="role-select" style={{marginRight:"30px"}}>
            <label htmlFor="role-select" >Role: </label>
            <select 
              id="role-select"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="Faculty">Faculty</option>
              <option value="Class Tutor">Class Tutor</option>
            </select>
          </div>
        )}
      </div>
      <div className="TClass">
        <h2>{className} - {course}</h2>

        {Array.isArray(subjects) && subjects.length > 1 ? (
          <div>
            <select 
              id="subject-select"
              value={selectedSubject ? selectedSubject.subName : ""}
              onChange={handleSubjectChange}
            >
              <option value="" disabled>Select a subject</option>
              {subjects.map(sub => (
                <option key={sub.subName} value={sub.subName}>
                  {sub.subName}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <h5>
            Subject: {selectedSubject ? selectedSubject.subName :  "No Subject Found, please go back and reselect the Class"}
          </h5>
        )}

        <div className="tercards">
          <div className="cardt" onClick={() => navigate("/takeAttendance", { state: { user, course, department, className, subject: selectedSubject } })}>
            <img className="att-mark" src={attendance} alt="Take Attendance" />
            <h3>Take Attendance</h3>
          </div>
          <div className="cardt" onClick={() => navigate("/selectSeriesT", { state: { user, course, department, className, subject: selectedSubject } })}>
            <img className="att-mark" src={mark} alt="Add Mark" />
            <h3>Add Mark</h3>
          </div>
          <div className="vcardt" onClick={() => navigate("/viewAttendance", { state: { user, course, department, className, subject: selectedSubject } })}>
            <h3>View Attendance</h3>
          </div>
          <div className="vcardt" onClick={() => navigate("/selectTestforMark", { state: { user, course, department, className, subject: selectedSubject } })}>
            <h3>View Mark</h3>
          </div>
          <div style={{ backgroundColor:"#4169E1" }} className="vcardt" onClick={() => navigate("/createQuestionPaper", { state: { user, course, department, className, subject: selectedSubject } })}>
            <h3>Create Question Paper</h3>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TCLass;
