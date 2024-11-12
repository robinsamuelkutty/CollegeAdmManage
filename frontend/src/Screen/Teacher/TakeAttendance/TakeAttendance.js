import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TakeAttendance.css";
import MNavBar from "../../../Components/MNavBar/MNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../../../Components/Footer/Footer";

function TakeAttendance() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [absentRollNos, setAbsentRollNos] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showLessonPopup, setShowLessonPopup] = useState(false); // State for lesson popup
  const [lessonPlan, setLessonPlan] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [allPresent, setAllPresent] = useState(false);
  const location = useLocation();
  const { user, course, department, className, subject } = location.state || {};
  const navigate = useNavigate();
  const [savedLessonPlan, setSavedLessonPlan] = useState("");
  const [savedDeliveryMethods, setSavedDeliveryMethods] = useState([]);

  const handleSaveLessonPlan = () => {
    // Save the current lesson plan and delivery methods to the state
    setSavedLessonPlan(lessonPlan);
    setSavedDeliveryMethods(deliveryMethods);
    setShowLessonPopup(false);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/students", {
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowPopup(false);
  };

  const handleHourChange = (e) => {
    const { value, checked } = e.target;
    setSelectedHours((prevHours) =>
      checked
        ? [...prevHours, value]
        : prevHours.filter((hour) => hour !== value)
    );
  };

  const handleSubmit = async () => {
    if (
      !absentRollNos ||
      !students ||
      !subject ||
      !selectedDate ||
      selectedHours.length === 0
    ) {
      console.error("One or more required variables are undefined or null:", {
        absentRollNos,
        students,
        subject,
        selectedDate,
        selectedHours,
      });
      return;
    }

    const absentRollNosArray = absentRollNos
      .split(",")
      .map((num) => num.trim());

    const updatedAttendance = students.map((student) => ({
      ...student,
      status: absentRollNosArray.includes(student.rollNo.toString())
        ? "absent"
        : "present",
    }));

    try {
      for (let hour of selectedHours) {
        for (let student of updatedAttendance) {
          const convertToMidnightUTC = (date) => {
            const adjustedDate = new Date(date);
            adjustedDate.setUTCHours(0, 0, 0, 0);
            return adjustedDate;
          };

          const payload = {
            studentId: student._id,
            subjectId: subject._id,
            date: convertToMidnightUTC(selectedDate),
            hour: hour,
            status: student.status,
            lessonPlan, // Include lesson plan
            deliveryMethods, // Include delivery methods
          };

          console.log("Submitting attendance for student:", payload);

          const response = await axios.post("/api/attendance", payload);
          console.log("Attendance saved:", response.data);
        }
      }
      navigate("/Tclass", {
        state: { user, course, department, className, subject },
      });
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  const handleShowTable = () => {
    if (absentRollNos && students.length > 0) {
      const absentRollNosArray = absentRollNos
        .split(",")
        .map((num) => num.trim());

      const updatedAttendance = students.map((student) => ({
        ...student,
        status: absentRollNosArray.includes(student.rollNo.toString())
          ? "absent"
          : "present",
      }));

      setAttendance(updatedAttendance);
      setShowTable(true);
    }
  };

  const handleLessonPlanChange = (e) => {
    setLessonPlan(e.target.value);
  };

  const handleDeliveryMethodChange = (e) => {
    const { value, checked } = e.target;
    setDeliveryMethods((prevMethods) =>
      checked
        ? [...prevMethods, value]
        : prevMethods.filter((method) => method !== value)
    );
  };
  const handleAllPresentChange = (e) => {
    const isChecked = e.target.checked;
    setAllPresent(isChecked);

    if (isChecked) {
      setAbsentRollNos("0"); // Clear absentees if all are present
      setAttendance(
        students.map((student) => ({
          ...student,
          status: "present",
        }))
      );
      setShowTable(true); // Show the table when "All are present" is checked
    } else {
      setShowTable(false); // Hide the table if unchecked
    }
  };

  return (
    <>
      <MNavBar user={user.teacher} />
      <div
        className="zxc"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <button
          className="back-btn"
          style={{
            background: "#FFAA1D",
            fontWeight: "bold",
            marginRight: "30px",
          }}
          onClick={() =>
            navigate("/editAttendance", {
              state: { user, course, department, className, subject },
            })
          }
        >
          Edit Attendance
        </button>
      </div>
      <div className="takeAtten">
        {!subject && (
          <div className="error-message" style={{marginLeft:"0px",fontWeight:"bold"}}>
            *Subject is not selected. Please select the subject.
          </div>
        )}

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
          <div className="selected-date">
            Selected Date: {selectedDate.toDateString()}
          </div>
        )}
        <div className="hour-select">
          <label>Select Hour(s):</label>
          <div className="hour-checkboxes">
            <label>
              <input
                style={{ marginRight: "3px" }}
                type="checkbox"
                value="1st Hour"
                onChange={handleHourChange}
                checked={selectedHours.includes("1st Hour")}
              />
              I
            </label>
            <label>
              <input
                style={{ marginRight: "3px" }}
                type="checkbox"
                value="2nd Hour"
                onChange={handleHourChange}
                checked={selectedHours.includes("2nd Hour")}
              />
              II
            </label>
            <label>
              <input
                style={{ marginRight: "3px" }}
                type="checkbox"
                value="3rd Hour"
                onChange={handleHourChange}
                checked={selectedHours.includes("3rd Hour")}
              />
              III
            </label>
            <label>
              <input
                style={{ marginRight: "3px" }}
                type="checkbox"
                value="4th Hour"
                onChange={handleHourChange}
                checked={selectedHours.includes("4th Hour")}
              />
              IV
            </label>
            <label>
              <input
                style={{ marginRight: "3px" }}
                type="checkbox"
                value="5th Hour"
                onChange={handleHourChange}
                checked={selectedHours.includes("5th Hour")}
              />
              V
            </label>
            <label>
              <input
                style={{ marginRight: "3px" }}
                type="checkbox"
                value="6th Hour"
                onChange={handleHourChange}
                checked={selectedHours.includes("6th Hour")}
              />
              VI
            </label>
          </div>
        </div>
        <div className="absenties">
          <label>
            Enter the Absentees:
            <input
              type="text"
              placeholder="Roll No's seperated by commas"
              value={absentRollNos}
              onChange={(e) => setAbsentRollNos(e.target.value)}
            />
          </label>
          <button type="button" className="save-btn" style={{backgroundColor:"#1877F2"}} onClick={handleShowTable}>
            OK
          </button>
        </div>
        <div className="all-present-checkbox">
          <label>
            <input
              type="checkbox"
              checked={allPresent}
              onChange={handleAllPresentChange}
            />
            All are present
          </label>
        </div>
        {showTable && attendance.length > 0 && (
          <div className="attendanceSheet">
            <h5>Attendance Sheet</h5>
            <table>
              <thead>
                <tr>
                  <th className="rollnoTh">Roll No</th>
                  <th className="nameTh">Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((student) => (
                  <tr key={student.rollNo}>
                    <td>{student.rollNo}</td>
                    <td>{student.name}</td>
                    <td className={student.status}>{student.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {savedLessonPlan && savedDeliveryMethods.length > 0 ? (
              <div style={{ width: "400px" }}>
                <p
                  style={{ float: "left", marginTop: "0", marginRight: "5px" }}
                >
                  Lesson Plan and Delivery Methods:
                </p>
                <h4>
                  {savedDeliveryMethods.join(", ")} - {savedLessonPlan}
                </h4>
              </div>
            ) : (
              <div style={{ display: "flex", width: "440px" }}>
                <p style={{ marginRight: "5px", marginLeft: "10px" }}>
                  Add Lesson and Delivery method to Attendance
                </p>
                <button
                  className="back-btn"
                  onClick={() => setShowLessonPopup(true)}
                  style={{ margin: "2px" }}
                >
                  Click here
                </button>
              </div>
            )}
            {absentRollNos && absentRollNos.trim() !== "0" && (
              <h3>
                Absentees: <p>{absentRollNos}</p>
              </h3>
            )}

            <button
              type="button"
              className="takeAttendence-btn"
              onClick={handleSubmit}
              style={{backgroundColor:"#28a745"}}
            >
              Proceed
            </button>
          </div>
        )}
        {showLessonPopup && (
          <div className="lesson-popup">
            <div className="lesson-popup-content">
              <button
                className="close-bttn"
                onClick={() => setShowLessonPopup(false)}
              >
                &times;
              </button>
              <h2>Lesson Plan</h2>
              <textarea
                value={lessonPlan}
                onChange={handleLessonPlanChange}
                placeholder="Enter the lesson plan..."
              />
              <h3>Delivery Methods</h3>
              <div className="delivery-methods">
                <label>
                  <input
                    type="checkbox"
                    value="Lecture"
                    onChange={handleDeliveryMethodChange}
                  />
                  Lecture
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Tutorial"
                    onChange={handleDeliveryMethodChange}
                  />
                  Tutorial
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Lab"
                    onChange={handleDeliveryMethodChange}
                  />
                  Lab
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Online Teaching"
                    onChange={handleDeliveryMethodChange}
                  />
                  Online Teaching
                </label>
              </div>
              <button className="save-btn" onClick={handleSaveLessonPlan}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default TakeAttendance;
