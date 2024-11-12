import React, { useState, useEffect } from 'react';
import Navbar from '../../../../Components/Navbar/Navbar';
import { useNavigate, useLocation } from "react-router-dom";
import goto from "../../../../images/goto.png";
import axios from 'axios';

const Department = () => {
  const { course } = useLocation().state || { course: 'No Course Selected' };
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editDepartment, setEditDepartment] = useState(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/departments?course=${course}`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, [course]);

  const handleAddDepartment = async () => {
    if (newDepartmentName.trim() !== '') {
      try {
        const response = await axios.post('http://localhost:5000/api/departments', { name: newDepartmentName, course });
        console.log('New department added:', response.data); // Log success message
        setDepartments([...departments, response.data]);
        setNewDepartmentName('');
        setIsAdding(false);
      } catch (error) {
        console.error('Error adding department:', error); // Log error message
      }
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await axios.delete(`/api/departments/${id}`);
      setDepartments(departments.filter((dept) => dept._id !== id));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleEditDepartment = (dept) => {
    setEditDepartment(dept._id);
    setEditDepartmentName(dept.name);
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await axios.put(`/api/departments/${id}`, { name: editDepartmentName });
      setDepartments(departments.map((dept) => (dept._id === id ? response.data : dept)));
      setEditDepartment(null);
      setEditDepartmentName('');
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleNavigateToClasses = (deptId, deptName) => {
    navigate('/Classes', { state: { departmentId: deptId, departmentName: deptName,course } });
  };

  return (
    <>
      <Navbar />
      <div className='class'>
        <h2 className='dpt'>Select Department</h2>
        <div className='Table-section'>
          <table>
            <thead>
              <tr>
                <th className='thclass'>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id}>
                  <td>
                    {editDepartment === dept._id ? (
                      <input
                        type="text"
                        value={editDepartmentName}
                        onChange={(e) => setEditDepartmentName(e.target.value)}
                      />
                    ) : (
                      dept.name
                    )}
                    <img className='goto' src={goto} alt='' onClick={() => handleNavigateToClasses(dept._id, dept.name)} />
                  </td>
                  <td>
                    {editDepartment === dept._id ? (
                      <button onClick={() => handleSaveEdit(dept._id)} className="addc-btn">Save</button>
                    ) : (
                      <button onClick={() => handleEditDepartment(dept)} className='editc-btn'>Edit</button>
                    )}
                    <button onClick={() => handleDeleteDepartment(dept._id)} className='dltc-btn'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isAdding ? (
            <>
              <input
                type="text"
                placeholder="New Department"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
              <button onClick={handleAddDepartment} className="addc-btn">Save</button>
            </>
          ) : (
            <button className="addc-btn" onClick={() => setIsAdding(true)}>+ Add Department</button>
          )}
        </div>
      </div>
    </>
  );
};

export default Department;
