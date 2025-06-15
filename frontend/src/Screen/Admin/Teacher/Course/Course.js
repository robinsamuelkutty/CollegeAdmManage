import React, { useEffect, useState } from "react";
import Navbar from "../../../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import btech from '../../../../images/btech.png'
import poly from "../../../../images/poly.png"
import mca from "../../../../images/mca.png"
import bca from "../../../../images/bca.png"
import bba from "../../../../images/bba.png"
import Footer from "../../../../Components/Footer/Footer";
import "./Course.css"
import axios from "axios";
function Course(){
    const navigate=useNavigate();
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const fetchCourses = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/courses`);
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
            await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/courses`, { name: course });
            setCourses([...courses, { name: course }]);
          }
          navigate(`/Tdepartment/${course}`, { state: { course } });
          console.log(course)
        } catch (error) {
          console.error('Error handling course click:', error);
        }
      };
    
    return(
        <>
            <Navbar/>
            <div className="main-body">
                <h2>Select Course</h2>
                <div className="toplevel">
                        <div onClick={() => handleCourseClick("BTech")}><img src={btech} alt=""/>BTECH</div>
                        <div onClick={() => handleCourseClick("Diploma")}><img src={poly} alt=""/>DIPLOMA</div>
                </div>
                <div className="downlevel">
                <div onClick={() => handleCourseClick("MCA")}><img src={mca} alt=""/>MCA</div>
                <div onClick={() => handleCourseClick("BCA")}><img src={bca} alt=""/>BCA</div>
                <div onClick={() => handleCourseClick("BBA")}><img src={bba} alt=""/>BBA</div>
                </div>

            </div>
            <Footer/>
        </>
    );
}
export default Course;