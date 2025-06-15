import React, { useState, useEffect } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import logo from "../../../images/titleLogo.png";
import Footer from '../../../Components/Footer/Footer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = '${process.env.REACT_APP_BACKEND_BASEURL}';

function CoursePlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course, department, className, subject } = location.state || {};

  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      console.log("Subject ID being sent:", subject._id);
  
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/courseplan`, {
          params: { subjectId: subject._id }
        });
        console.log("Response from /courseplan:", response.data);
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
  
    if (subject && subject._id) {
      fetchAttendanceData();
    }
  }, [subject]);

 const handleExport = () => {
  const input = document.querySelector('.percentAttendance'); // The div you want to export

  html2canvas(input)
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4'); // Set format to A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      let imgWidth = canvas.width;
      let imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      imgWidth *= ratio;
      imgHeight *= ratio;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`CoursePlan-${className}-${course}.pdf`);
    })
    .catch((error) => {
      console.error('Error generating PDF:', error);
    });
};

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className='zxc'>
        <button className='back-btn' onClick={() => navigate("/TClass", { state: { user, course, department, className, subject } })}>Back</button>
        <div className='viewAttendance'>
          <p className='desktop-view-message'>For a better experience, please switch to desktop view.</p>
          <div className='percentAttendance' style={{ background: "white" }}>
            <div className='pdfHeader' style={{ overflowX: "hidden",marginLeft:"0px" }}>
              <div style={{ overflowX: "hidden", width: "450px", marginLeft: "30px" }}>
                <img style={{ height: "90px", float: "left", marginTop: "10px", marginRight: "5px" }} src={logo} alt='' />
                <h2 style={{ marginTop: "40px" }}>College of Engineering, Poonjar</h2>
              </div>
              <div>
                <h3 style={{ marginLeft: "80px" }}>{course} in {department}</h3>
                <h3 style={{ marginLeft: "20px" }}>Branch: Department of {department}</h3>
                
              </div>
            </div>
            <h5 style={{ marginTop: "7px" }}>Course Plan: {subject.subName}</h5>
            <h4>Faculty Name: {user.teacher.name}</h4>

            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th className='rollnoTh' style={{width:"80px"}}>No</th>
                    <th className='rollnoTh' style={{width:"200px"}}>Date</th>
                    <th className='nameTh'>Topics to be covered</th>
                    <th className='viewMarkTh' style={{width:"250px"}}>Mode of Instruction</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{new Date(record.date).toLocaleDateString('en-GB')}</td>

                      <td>{record.lessonPlan || "N/A"}</td>
                      <td>{record.deliveryMethods.join(', ') || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button style={{ marginTop: "20px" }} className='save-btn' onClick={handleExport}>Export</button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CoursePlan;
