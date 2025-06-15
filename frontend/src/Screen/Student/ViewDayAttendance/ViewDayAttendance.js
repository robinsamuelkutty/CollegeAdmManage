import React, { useState } from "react";
import "./ViewDayAttendance.css";
import MNavBar from "../../../Components/MNavBar/MNavBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from "../../../Components/Footer/Footer";

function ViewDayAttendance() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setShowPopup(false);

    if (user && user.student._id) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendanceviewday/student`, {
          params: {
            studentId: user.student._id,
            date: date.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
          },
        });
        console.log("date concept", response.data);
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    }
  };

  // Function to parse the hour string and extract the numeric part
  const parseHour = (hourStr) => {
    return parseInt(hourStr.match(/\d+/)[0], 10); // Extracts the number from a string like "1st Hour"
  };

  return (
    <>
      <MNavBar user={user.student} />
      <div className={`content-wrapper ${showPopup ? 'blurred' : ''}`}>
        <div className='zxc'>
          <button className='back-btn' onClick={() => navigate("/student-Attendance", { state: { user } })}>Back</button>
        </div>
        <div className="view-day-attendance">
          <div className="sltdate">
            <button className="date-btn" onClick={() => setShowPopup(true)}>
              Select Date
            </button>
          </div>
          {selectedDate && (
            <div className="selected-date">
              Selected Date: {selectedDate.toDateString()}
            </div>
          )}
          {selectedDate && attendanceData.length > 0 && (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th className="hour-th">Hour</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData
                  .sort((a, b) => parseHour(a.hour) - parseHour(b.hour)) // Sort the attendance data by parsed hour
                  .map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.hour}</td>
                      <td className={entry.status}>{entry.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer/>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-bttn" onClick={() => setShowPopup(false)}>
              &times;
            </button>
            <DatePicker selected={selectedDate} onChange={handleDateChange} inline />
          </div>
        </div>
      )}
      
    </>
  );
}

export default ViewDayAttendance;
