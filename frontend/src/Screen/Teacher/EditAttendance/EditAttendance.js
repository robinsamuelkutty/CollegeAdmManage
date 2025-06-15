import React, { useEffect, useState } from "react";
import MNavBar from "../../../Components/MNavBar/MNavBar";
import Footer from "../../../Components/Footer/Footer";
import "./EditAttendance.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function EditAttendance() {
  const location = useLocation();
  const { user, course, department, className, subject } = location.state || {};
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hours, setHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [lessonPlan, setLessonPlan] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [updatedAttendance, setUpdatedAttendance] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, {
          params: {
            course,
            department,
            class: className,
          },
        });

        const sortedStudents = response.data.sort(
          (a, b) => a.rollNo - b.rollNo
        );
        setStudents(sortedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    if (course && department && className) {
      fetchStudents();
    }
  }, [course, department, className]);

  const fetchHours = async (date) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendance/student`, {
        params: { 
          studentId: students[0]._id, 
          date,
          subjectId: subject._id  // Pass the subjectId
        },
      });
      // Sorting hours
      const sortedHours = response.data.sort((a, b) => parseHour(a.hour) - parseHour(b.hour));
      setHours(sortedHours);
    } catch (error) {
      console.error("Error fetching hours:", error);
    }
  };
  

  const parseHour = (hourStr) => {
    return parseInt(hourStr.match(/\d+/)[0], 10); // Extracts the number from a string like "1st Hour"
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchHours(date);
    setShowPopup(false);
  };

  const handleHourClick = async (hour) => {
    setSelectedHour(hour);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendance/student`, {
        params: {
          studentId: students[0]._id,
          date: selectedDate,
          hour: hour,
        },
      });

      const selectedAttendance = response.data.find(
        (record) => record.hour === hour
      );
      if (selectedAttendance) {
        setLessonPlan(selectedAttendance.lessonPlan || "");
        setDeliveryMethods(selectedAttendance.deliveryMethods || []);
        setUpdatedAttendance(
          response.data.reduce((acc, student) => {
            if (student.studentId) {
              acc[student.studentId] = student.status;
            }
            return acc;
          }, {})
        );
      } else {
        setLessonPlan("");
        setDeliveryMethods([]);
        setUpdatedAttendance({});
      }
    } catch (error) {
      console.error("Error fetching attendance details:", error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setUpdatedAttendance({
      ...updatedAttendance,
      [studentId]: status,
    });
  };

  const handleUpdate = async () => {
    const convertToMidnightUTC = (date) => {
      const adjustedDate = new Date(date);
      adjustedDate.setUTCHours(0, 0, 0, 0);
      return adjustedDate;
    };
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendance`, {
        attendanceData: updatedAttendance,
        date: convertToMidnightUTC(selectedDate),
        hour: selectedHour,
        subjectId: subject._id,
      });

      setSuccessMessage("Attendance updated successfully");
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className="zxc">
        <button
          className="back-btn"
          onClick={() =>
            navigate("/TClass", {
              state: { user, course, department, className, subject },
            })
          }
        >
          Back
        </button>
      </div>
      <div className="editAttendance">
        <div className="sltdate">
          <button className="date-btn" onClick={() => setShowPopup(true)}>
            Select Date
          </button>
        </div>
        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <button
                className="close-bttn"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            </div>
          </div>
        )}
        {selectedDate && (
          <>
            <div className="selected-date">
              Selected Date: {selectedDate.toDateString()}
            </div>
            <div className="showHours">
              {hours.map((hour, index) => (
                <button
                  key={index}
                  onClick={() => handleHourClick(hour.hour)}
                  className={selectedHour === hour.hour ? "selected" : ""}
                >
                  {hour.hour}
                </button>
              ))}
            </div>
            {hours.length > 0 && selectedHour && (
              <>
                <div className="lesson-delivery">
                  <p>
                      Delivery Methods and Lesson Plan: {deliveryMethods.join(", ")} - {lessonPlan}
                    
                  </p>
                </div>
                <div className="attendance-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td>{student.rollNo}</td>
                          <td>{student.name}</td>
                          <td>
                            <button
                              className={
                                updatedAttendance[student._id] === "present"
                                  ? "present"
                                  : ""
                              }
                              onClick={() =>
                                handleAttendanceChange(student._id, "present")
                              }
                            >
                              P
                            </button>
                            <button
                              className={
                                updatedAttendance[student._id] === "absent"
                                  ? "absent"
                                  : ""
                              }
                              onClick={() =>
                                handleAttendanceChange(student._id, "absent")
                              }
                            >
                              Ab
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="save-btn" onClick={handleUpdate}>
                  Update
                </button>
                {successMessage && (
                  <p
                    className="success-message"
                    style={{ marginLeft: "0px", marginTop: "20px" }}
                  >
                    {successMessage}
                  </p>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default EditAttendance;
