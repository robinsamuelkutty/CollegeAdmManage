import React, { useState, useEffect} from 'react';
import Navbar from '../../../Components/Navbar/Navbar';
import { FaTimes } from 'react-icons/fa';
import stdlogo from '../../../images/teacher.png';
import axios from 'axios';
import '../Teacher/TeacherClass/TeacherClass.css';

function ClassTutor() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
const [selectedClass, setSelectedClass] = useState(null);

  const [teachersInClass, setTeachersInClass] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState({ userId: '', name: '',  _id: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState({ userId: '', name: '', subName: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers`);
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  // Fetch departments based on selected course
  useEffect(() => {
    if (selectedCourse) {
      fetchDepartments(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchDepartments = async (course) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/departments?course=${course}`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  // Fetch classes based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      fetchClasses(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchClasses = async (selectedDepartment) => {
    
    try {
      
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/classes?departmentId=${selectedDepartment._id}`);
      setClasses(response.data);
      console.log("classes in fetch classes",response.data)
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

 

 
  
  

  // Fetch teachers for the selected course, department, and class
  useEffect(() => {
    const fetchTeachersInClass = async () => {
      console.log("Fetching teachers in class");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachersInClass`, {
          params: {
            tutor: true  // Only fetch teachers who are tutors
          }
        });
        setTeachersInClass(response.data);
        console.log("Teachers in class:", response.data);
      } catch (error) {
        console.error('Error fetching teachers in class:', error);
        setTeachersInClass([]);
      }
    };
      fetchTeachersInClass();
    
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher({ userId: '', name: '',  _id: '' });
  };

  const handleAddTeacherToClass = (e) => {
    e.preventDefault();
    if (!selectedTeacher._id || !selectedCourse || !selectedDepartment || !selectedClass) {
      return;
    }
  
    axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/addToClass`, {
      teacherId: selectedTeacher._id,
      course: selectedCourse,
      department: selectedDepartment, // Now passing the whole department object
      class: selectedClass,           // Now passing the whole class object
      tutor: true
    })
    .then(response => {
      setTeachersInClass([...teachersInClass, response.data]);
      closeModal();
    })
    .catch(error => console.error('Error adding teacher to class:', error));
  };
  

  const handleEditTeacher = (index) => {
    setEditingIndex(index);
    setEditingTeacher(teachersInClass[index]);
  };

  const handleSaveEdit = () => {
    const updatedTeachers = [...teachersInClass];
    updatedTeachers[editingIndex] = editingTeacher;
    setTeachersInClass(updatedTeachers);
    setEditingIndex(null);

    axios.put(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/update/${editingTeacher._id}`, editingTeacher)
      .then(response => {
        console.log('Teacher updated successfully:', response.data);
      })
      .catch(error => console.error('Error updating teacher:', error));
  };

  const handleDeleteTeacher = (index) => {
    const teacherToDelete = teachersInClass[index];
  
    // Extract the class ID from the teacher's classes array (assuming it's the first class in the array)
    const classToDelete = teacherToDelete.classes[0]; // Adjust the index if you're targeting a specific class
    const classId = classToDelete._id;
  
    console.log("Class ID to delete:", classId);
  
    // Remove the teacher from the local state
    setTeachersInClass(teachersInClass.filter((_, i) => i !== index));
  
    console.log("Teacher ID in delete section:", teacherToDelete._id);
  
    // Make the DELETE request with the class ID
    axios.delete(`${process.env.REACT_APP_BACKEND_BASEURL}/api/teachers/removeFromClass/${teacherToDelete._id}`, {
        data: { classId }
      })
      .then(response => {
        console.log('Teacher removed successfully:', response.data);
      })
      .catch(error => console.error('Error removing teacher:', error));
  };
  
  

  return (
    <>
      <Navbar />
      <div className={`TeacherClasses ${isModalOpen ? 'blur' : ''}`}>
        <div className='Students-Details'>
          <h5>Class Tutor List</h5>
          <div className='StdDetailsTable'>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th style={{width:"100px"}}>Course</th>
                  <th>Department</th>
                  <th style={{width:"100px"}}>Class</th>
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
          <td>{selectedCourse}</td>
          <td>{selectedDepartment?.name || ''}</td>
          <td>{selectedClass?.name || ''}</td>
          <td><button onClick={handleSaveEdit} className="addc-btn">Save</button></td>
        </>
      ) : (
        <>
          <td>{teacher.userId}</td>
          <td>{teacher.name}</td>
          <td >{teacher.classes?.[0]?.course || ''}</td>
          <td>{teacher.classes?.[0]?.department?.name || ''}</td>
          <td>{teacher.classes?.[0]?.className?.name || ''}</td>
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
                <img className="studlogo" src={stdlogo} alt="Add Teacher" /> Add  Class Tutor
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modall">
          <div className="modalcontent" style={{height:"440px"}}>
            <button className="closebtn" onClick={closeModal}><FaTimes /></button>
            <h3>Add Existing Teacher to Class Tutor</h3>
            <form onSubmit={handleAddTeacherToClass} className="addteacherda">
              <label>
                Select Teacher:
                <select
                  value={selectedTeacher._id}
                  onChange={(e) => {
                    const teacher = teachers.find(t => t._id === e.target.value) || {};
                    setSelectedTeacher({ userId: teacher.userId || '', name: teacher.name || '', _id: teacher._id });
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
                Select Course:
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  <option value="" disabled>Select Course</option>
                  <option value="BTech">BTech</option>
                  <option value="Diploma">Diploma</option>
                  <option value="MCA">MCA</option>
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>

                </select>
              </label>

              <label>
  Select Department:
  <select
    value={selectedDepartment?._id || ''}
    onChange={(e) => {
      const department = departments.find(dept => dept._id === e.target.value);
      setSelectedDepartment(department);
    }}
  >
    <option value="" disabled>Select Department</option>
    {departments.map((dept) => (
      <option key={dept._id} value={dept._id}>
        {dept.name}
      </option>
    ))}
  </select>
</label>

<label>
  Select Class:
  <select
    value={selectedClass?._id || ''}
    onChange={(e) => {
      const cls = classes.find(cls => cls._id === e.target.value);
      setSelectedClass(cls);
    }}
  >
    <option value="" disabled>Select Class</option>
    {classes.map((cls) => (
      <option key={cls._id} value={cls._id}>
        {cls.name}
      </option>
    ))}
  </select>
</label>


              <button type="submit" className="addtbtn">Add</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ClassTutor;
