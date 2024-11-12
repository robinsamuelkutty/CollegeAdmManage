import React, { useEffect, useState } from "react";
import Navbar from "../../../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./StudPage.css";
import axios from "axios";
import Footer from "../../../../Components/Footer/Footer";

axios.defaults.baseURL = 'http://localhost:5000';

function StudPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    

    fetchCourses();
  
  }, []);

  const handleCourseClick = async (course) => {
    try {
      const existingCourse = courses.find(c => c.name === course);
      if (!existingCourse) {
        await axios.post('/api/courses', { name: course });
        setCourses([...courses, { name: course }]);
      }
      navigate(`/department/${course}`, { state: { course } });
      console.log(course)
    } catch (error) {
      console.error('Error handling course click:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pagebody">
        
        <div className="upper">
          <div className="cards" onClick={() => handleCourseClick("BTech")}>
            <h3>BTECH</h3>
            
            
          </div>
          <div className="cards" onClick={() => handleCourseClick("Diploma")}>
            <h3>DIPLOMA</h3>
            
            
          </div>
        </div>
        <div className="lower">
          <div className="cards" onClick={() => handleCourseClick("MCA")}>
            <h3>MCA</h3>
            
           
          </div>
          <div className="cards" onClick={() => handleCourseClick("BCA")}>
            <h3>BCA</h3>
            
            
          </div>
          <div className="cards" onClick={() => handleCourseClick("BBA")}>
            <h3>BBA</h3>
            
           
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default StudPage;
