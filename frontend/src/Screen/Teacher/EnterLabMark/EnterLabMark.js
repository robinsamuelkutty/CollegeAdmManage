import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MNavBar from "../../../Components/MNavBar/MNavBar";
import Footer from "../../../Components/Footer/Footer";
import "../EnterMark/EnterMark.css";

function EnterLabMark() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course, department, className, subject,testName } = location.state || {};

  const [marks, setMarks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newCEL, setNewCEL] = useState("");
  const [newCAT, setNewCAT] = useState("");
  const [newViva, setNewViva] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/students`, {
          params: { class: className, department, course },
        });

        // Sort students by rollNo
        const sortedStudents = response.data.sort(
          (a, b) => a.rollNo - b.rollNo
        );

        setMarks(
          sortedStudents.map((student) => ({
            ...student,
            CEL: "",
            CAT: "",
            viva: "",
          }))
        );
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [className, department, course]);

  const handleEdit = (index) => {
    setEditing(index);
    setNewCEL(marks[index].CEL || "");
    setNewCAT(marks[index].CAT || "");
    setNewViva(marks[index].viva || "");
  };

  const handleSave = (index) => {
    const updatedMarks = [...marks];
    updatedMarks[index].CEL = newCEL;
    updatedMarks[index].CAT = newCAT;
    updatedMarks[index].viva = newViva;
    setMarks(updatedMarks);
    setEditing(null);
    setNewCEL("");
    setNewCAT("");
    setNewViva("");
  };

  const handleCELChange = (event) => {
    setNewCEL(event.target.value);
  };

  const handleCATChange = (event) => {
    setNewCAT(event.target.value);
  };

  const handleVivaChange = (event) => {
    setNewViva(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      for (const student of marks) {
        console.log("studentheyy", student);
        if (student.CEL || student.CAT || student.viva) {
          console.log(
            "lab",
            student.CEL,
            student.CAT,
            student.viva,
            testName,
            subject,
            user.teacher._id
          );
          await axios.put(`${process.env.REACT_APP_BACKEND_BASEURL}/api/marksforlab/${student._id}`, {
            CEL: student.CEL,
            CAT: student.CAT,
            viva: student.viva,
            testName,
            subject,
            teacherId: user.teacher._id, // Ensure teacherId is sent
          });
        }
      }
      navigate("/TClass", {
        state: { user, course, department, className, subject },
      });
    } catch (error) {
      console.error("Error updating student marks:", error);
    }
  };

  return (
    <>
      <MNavBar user={user.teacher} />
      <div className="enterMark">
        <h5>Enter Mark for Lab Internal</h5>
        <div className="markTable">
          <table>
            <thead>
              <tr>
                <th className="rollnoTh">Roll No</th>
                <th className="nameTh">Name</th>
                <th className="celTh">
                  <span>Continuous Evaluation in Lab</span>
                </th>
                <th className="catTh">
                  <span>
                    Continuous Assessment <br />
                    Test
                  </span>
                </th>
                <th>Viva-voce</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((student, index) => (
                <tr key={student._id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>
                    {editing === index ? (
                      <input
                        type="text"
                        value={newCEL}
                        onChange={handleCELChange}
                      />
                    ) : (
                      student.CEL
                    )}
                  </td>
                  <td>
                    {editing === index ? (
                      <input
                        type="text"
                        value={newCAT}
                        onChange={handleCATChange}
                      />
                    ) : (
                      student.CAT
                    )}
                  </td>
                  <td>
                    {editing === index ? (
                      <input
                        type="text"
                        value={newViva}
                        onChange={handleVivaChange}
                      />
                    ) : (
                      student.viva
                    )}
                  </td>
                  <td>
                    {editing === index ? (
                      <button onClick={() => handleSave(index)}>Save</button>
                    ) : (
                      <button onClick={() => handleEdit(index)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="submit"
          className="takeAttendence-btn"
          onClick={handleSubmit}
        >
          Add Mark
        </button>
      </div>
      <Footer />
    </>
  );
}

export default EnterLabMark;
