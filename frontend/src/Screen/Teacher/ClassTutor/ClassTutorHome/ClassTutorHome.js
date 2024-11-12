import React,{useEffect,useState} from 'react';

import MNavBar from '../../../../Components/MNavBar/MNavBar';
import { useNavigate } from 'react-router-dom';
import attendance from "../../../../images/attendance.png";
import mark from "../../../../images/grade.png";
import { useLocation } from 'react-router-dom';

import Footer from '../../../../Components/Footer/Footer';
import axios from 'axios';

function ClassTutorHome() {
    const location = useLocation();
    const { user, course, department, className} = location.state || {};
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("Class Tutor");
    const [classes, setClasses] = useState([]);

    // Fetch classes for the teacher on component mount
    useEffect(() => {
      const fetchClasses = async () => {
        if (!user || !user.teacher || !user.teacher._id) {
          console.error("Teacher ID is missing");
          return;
        }
    
        try {
          const response = await axios.get(`/api/teachers/${user.teacher._id}/classes`);
          setClasses(response.data);
          console.log("Classes fetched:", response.data);
        } catch (error) {
          console.error('Error fetching classes:', error);
        }
      };
    
      fetchClasses();
    }, [user]);
    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
        if (event.target.value === "Faculty") {
          navigate("/TClass", { state: { user, course, department, className } });
        } else if (event.target.value === "Class Tutor") {
          navigate("/classTutorHome", { state: { user, course, department, className,  } });
        }
      };
      const isTutor = classes.some(cls => cls.tutor);
  return (
    <>
    <MNavBar user={user.teacher} />
    <div
        className="zxc"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        {isTutor && (
          <div className="role-select" style={{marginRight:"30px",marginTop:"66px"}}>
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
        <h7 style={{marginTop:"0px"}}>{className} - {course}</h7> 
        
        <div className="tercards">
          <div className="cardt" onClick={() => navigate("/selectSubjectAttenCT", { state: { user, course, department, className } })}>
            <img className="att-mark" src={attendance} alt="" />
            <h3>Attendance</h3>
          </div>
          <div className="cardt" onClick={() => navigate("/selectSubjectTestCT", { state: { user, course, department, className } })}>
            <img className="att-mark" src={mark} alt="" />
            <h3>Mark</h3>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default ClassTutorHome