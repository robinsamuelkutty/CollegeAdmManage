import React, { useState, useEffect } from 'react';
import MNavBar from '../../../../Components/MNavBar/MNavBar';
import Footer from '../../../../Components/Footer/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import goto from '../../../../images/goto.png'; // Ensure the correct path to the image

function CTselectSub() {
    const location = useLocation();
    const { user, course, department, className } = location.state || {};
    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/subjectsforCT`, {
                    params: { course, department, className }
                });
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, [course, department, className]);

    return (
        <>
            <MNavBar user={user.teacher} />
            <div className="zxc" >
        <button
          className="back-btn"
          onClick={() =>
            navigate("/classTutorHome", {
              state: { user, course, department, className },
            })
          }
        >
          Back
        </button>
      </div>
            <div className='class'>
                <h2 className='dpt'>Select a Subject</h2>
                <div className='Table-section'>
                    <table>
                        <thead>
                            <tr>
                                <th className='thclass'>Subjects</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject._id}>
                                    <td>
                                        {subject.subName}
                                        <img
                                            className='goto'
                                            src={goto}
                                            alt='Go to'
                                            onClick={() => navigate("/subjectCT", {
                                                state: {
                                                    user,
                                                    course,
                                                    department,
                                                    className,
                                                    subject
                                                   
                                                }
                                            })}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CTselectSub;
