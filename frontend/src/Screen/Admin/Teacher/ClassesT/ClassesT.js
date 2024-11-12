// Classes.js
import React, { useState, useEffect } from 'react';
import Navbar from '../../../../Components/Navbar/Navbar';
import '../../Student/Classes/Classes.css'
import { useNavigate, useLocation } from "react-router-dom";
import goto from "../../../../images/goto.png";
import axios from 'axios';
import Footer from '../../../../Components/Footer/Footer';
const ClassesT = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { departmentId, departmentName,course } = location.state || { departmentId: '', departmentName: 'No Department Selected' };
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [editClass, setEditClass] = useState(null);
    const [editClassName, setEditClassName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/classes?departmentId=${departmentId}`);
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };
        if (departmentId) {
            fetchClasses();
        }
    }, [departmentId]);

    const handleAddClass = async () => {
        if (newClassName.trim() !== '') {
            try {
                const response = await axios.post('http://localhost:5000/api/classes', { name: newClassName, departmentId });
                setClasses([...classes, response.data]);
                setNewClassName('');
                setIsAdding(false); // Hide input section after adding
            } catch (error) {
                console.error('Error adding class:', error);
            }
        }
    };

    const handleDeleteClass = async (id) => {
        try {
            await axios.delete(`/api/classes/${id}`);
            setClasses(classes.filter((cls) => cls._id !== id));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    const handleEditClass = (cls) => {
        setEditClass(cls._id);
        setEditClassName(cls.name);
    };

    const handleSaveEdit = async (id) => {
        try {
            const response = await axios.put(`/api/classes/${id}`, { name: editClassName });
            setClasses(classes.map((cls) => (cls._id === id ? response.data : cls)));
            setEditClass(null);
            setEditClassName('');
        } catch (error) {
            console.error('Error updating class:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className='class'>
                <h2 className='dpt'>{departmentName}</h2>
                <div className='Table-section'>
                    <table>
                        <thead>
                            <tr>
                                <th className='thclass'>Class</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls) => (
                                <tr key={cls._id}>
                                    <td>
                                        {editClass === cls._id ? (
                                            <input
                                                type="text"
                                                value={editClassName}
                                                onChange={(e) => setEditClassName(e.target.value)}
                                            />
                                        ) : (
                                            cls.name
                                        )}
                                        <img className='goto' src={goto} alt='' onClick={() => navigate("/TeacherClass", { state: { classId: cls._id, className: cls.name,departmentId, departmentName,course } })} />
                                    </td>
                                    <td>
                                        {editClass === cls._id ? (
                                            <button onClick={() => handleSaveEdit(cls._id)} className="addc-btn">Save</button>
                                        ) : (
                                            <button onClick={() => handleEditClass(cls)} className='editc-btn'>Edit</button>
                                        )}
                                        <button onClick={() => handleDeleteClass(cls._id)} className='dltc-btn'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {isAdding ? (
                        <>
                            <input
                                type="text"
                                placeholder="New Class"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                            />
                            <button onClick={handleAddClass} className="addc-btn">Save</button>
                        </>
                    ) : (
                        <button className="addc-btn" onClick={() => setIsAdding(true)}>+ Add Class</button>
                    )}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ClassesT;