import React, { useState, useEffect } from 'react';
import Navbar from '../../../../Components/Navbar/Navbar';
import { FaTimes } from 'react-icons/fa';
import stdlogo from '../../../../images/teacher.png';
import axios from 'axios';
import './TeacherClass.css';
import { useLocation } from 'react-router-dom';

function TeacherClass() {
  const location = useLocation();
  const { classId, className, departmentName, course } = location.state || { classId: '', className: 'No Class Selected', department: '', course: '' };
  const [teachers, setTeachers] = useState([]);
  const [teachersInClass, setTeachersInClass] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState({ userId: '', name: '', subName: '', _id: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState({ userId: '', name: '', subName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers`)
      .then(response => {
        setTeachers(response.data);
        console.log("teachers:", response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the teachers!', error);
      });

    // Fetch subjects for the selected class
    if (classId) {
      axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/subjects?classId=${classId}`)
        .then(response => {
          setTeachersInClass(response.data.map(subject => ({
            ...subject.teacherId,
            subName: subject.subName,
            subjectId: subject._id,
            lab: subject.lab  
          })));
          console.log("class ID", classId);
        })
        .catch(error => {
          console.error('There was an error fetching the subjects!', error);
        });
    }
  }, [classId]);

  const handleAddTeacherToClass = async (e) => {
    e.preventDefault();
    const teacherId = selectedTeacher._id;
    const subjectData = {
      subName: selectedTeacher.subName,
      className,
      classId,
      department: departmentName,
      course,
      teacherId,
      lab: selectedTeacher.lab 
    };

    console.log("classID", classId);
    console.log("subject:", subjectData);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/subjects`, subjectData);
      const newSubject = response.data;
      console.log("newsubject", newSubject);

      setTeachersInClass((prevTeachers) => [
        ...prevTeachers,
        { ...selectedTeacher, subName: newSubject.subName, subjectId: newSubject._id, lab: newSubject.lab },
      ].sort((a, b) => (a.name || "").localeCompare(b.name || "")));

      setSelectedTeacher({ userId: '', name: '', subName: '', lab: false  });
      setIsModalOpen(false);
    } catch (error) {
      console.error('There was an error adding the subject!', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const subjectId = editingTeacher.subjectId; // Get the subject ID from the currently editing teacher
      
      console.log("Editing teacher:", editingTeacher);
      console.log("Subject ID for editing:", subjectId);
  
      // Send a PUT request to update the subject
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_BASEURL}/api/subjects/${subjectId}`, {
        userId: editingTeacher.userId,
        name: editingTeacher.name,
        subName: editingTeacher.subName,
        lab: editingTeacher.lab
      });
  
      const updatedTeacher = response.data;
  
      console.log("Updated teacher data received from the server:", updatedTeacher);
  
      // Update the state with the updated teacher
      const updatedTeachers = [...teachersInClass];
      updatedTeachers[editingIndex] = { 
        ...editingTeacher, 
        userId: updatedTeacher.userId,
        name: updatedTeacher.name,
        subName: updatedTeacher.subName,
        lab: updatedTeacher.lab
      };
      
      setTeachersInClass(updatedTeachers.sort((a, b) => (a.name || "").localeCompare(b.name || "")));
  
      // Reset the editing state
      setEditingIndex(null);
      setEditingTeacher({ userId: '', name: '', subName: '', lab: false });
    } catch (error) {
      console.error('There was an error updating the subject!', error);
    }
  };
  
  

  const handleDeleteTeacher = async (index) => {
    try {
      console.log("Attempting to delete subject at index:", index);
      const teacher = teachersInClass[index];
      const subjectId = teacher.subjectId;  // Correctly use the subjectId
      console.log("Deleting subject with ID:", subjectId);

      await axios.delete(`${process.env.REACT_APP_BACKEND_BASEURL}/api/subjects/${subjectId}`);
      setTeachersInClass((prevTeachers) =>
        prevTeachers.filter((_, i) => i !== index)
      );
    } catch (error) {
      console.error('There was an error deleting the subject!', error);
    }
  };

  const handleEditTeacher = (index) => {
    setEditingIndex(index);
    setEditingTeacher(teachersInClass[index]);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher({ userId: '', name: '', subName: '',lab: false });
  };

  return (
    <>
           <Navbar />
      <div className={`TeacherClasses ${isModalOpen ? 'blur' : ''}`}>
        <div className='Students-Details'>
          <h2>{departmentName}</h2>
          <h5>{className} {course}</h5>
          <div className='StdDetailsTable'>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Lab</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachersInClass.map((teacher, index) => (
                  <tr key={index}>
                    {editingIndex === index ? (
                      <>
                        <td><input type="text" value={editingTeacher.userId} onChange={(e) => setEditingTeacher({ ...editingTeacher, userId: e.target.value })} /></td>
                        <td><input type="text" value={editingTeacher.name} onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })} /></td>
                        <td><input type="text" value={editingTeacher.subName} onChange={(e) => setEditingTeacher({ ...editingTeacher, subName: e.target.value })} /></td>
                        <td><input type="checkbox" checked={editingTeacher.lab} onChange={(e) => setEditingTeacher({ ...editingTeacher, lab: e.target.checked })} /></td>
                        <td><button onClick={handleSaveEdit} className="addc-btn">Save</button></td>
                      </>
                    ) : (
                      <>
                        <td>{teacher.userId}</td>
                        <td>{teacher.name}</td>
                        <td>{teacher.subName}</td>
                        <td>{teacher.lab ? 'Yes' : 'No'}</td>
                        <td>
                          <button onClick={() => handleEditTeacher(index)} className='editc-btn'>Edit</button>
                          <button onClick={() => handleDeleteTeacher(index)} className='dltc-btn'>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <button className="btn" onClick={openModal}>
                <img className="studlogo" src={stdlogo} alt="Add Teacher" /> Add Teacher to Class
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modall">
          <div className="modalcontent">
            <button className="closebtn" onClick={closeModal}><FaTimes /></button>
            <h3>Add Existing Teacher to Class</h3>
            <form onSubmit={handleAddTeacherToClass} className="addteacherda">
              <label>
                Select Teacher:
                <select
                  value={selectedTeacher._id}
                  onChange={(e) => {
                    const teacher = teachers.find(t => t._id === e.target.value) || {};
                    setSelectedTeacher({ userId: teacher.userId || '', name: teacher.name || '', subName: '', _id: teacher._id || '', lab: false });
                  }}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Subject:
                <input
                  type="text"
                  placeholder="Course Code - Name"
                  value={selectedTeacher.subName}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, subName: e.target.value })}
                />
              </label>
              
              <label>
                if the Subject is Lab:
                <input
                  type="checkbox"
                  checked={selectedTeacher.lab}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, lab: e.target.checked })}
                  style={{width:"25px"}}
                />
              </label>
              <button type="submit" className="add-btn">Add</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default TeacherClass;
