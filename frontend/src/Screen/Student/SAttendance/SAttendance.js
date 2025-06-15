import React, { useState, useEffect } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './SAttendance.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Footer from '../../../Components/Footer/Footer';

function SAttendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};
  const [subjects, setSubjects] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    // Fetch attendance data
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASEURL}/api/attendance/student/${user.student._id}`);
        const subjectData = response.data;

        // Set subjects with attendance data
        setSubjects(subjectData);
        console.log("subject data", subjectData);

        // Calculate progress for each subject
        const targetProgress = subjectData.map(subject => {
          if (subject.totalClasses === 0) return 0; // Avoid division by zero
          const percentage = (subject.attendedClasses / subject.totalClasses) * 100;
          return percentage;
        });

        // Animate progress
        const animateProgress = (start, end, duration) => {
          let startTime = null;

          const animate = currentTime => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = start.map((s, i) => {
              const distance = end[i] - s;
              return s + (distance * Math.min(timeElapsed / duration, 1));
            });
            setProgress(progress);

            if (timeElapsed < duration) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        };

        animateProgress(new Array(targetProgress.length).fill(0), targetProgress, 1000);

      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, [user.student._id]);

  return (
    <>
      <MNavBar user={user.student} />
      <div className='zxc'>
        <button className='back-btn' onClick={() => navigate("/student", { state: { user } })}>Back</button>
        <div className='SAttendance'>
          <button className='takeAttendence-btn' onClick={()=>navigate("/viewDayAttendance",{state:{user}})}> View Day By Day Attendance</button>
          <h2>Attendance</h2>
          {subjects.map((subject, index) => (
            <div key={index} className='subject-card'>
              <h6>{subject.name}</h6>
              <p>{subject.attendedClasses}/{subject.totalClasses}</p>
              <div className='circular-progress'>
                <CircularProgressbar
                  value={progress[index] || 0} // Ensure progress is not NaN
                  text={`${Math.round(progress[index] || 0)}%`} // Ensure text is not NaN
                  styles={buildStyles({
                    pathColor: progress[index] >= 75 ? '#0C2D57' : '#FF0000',
                    textColor: progress[index] >= 75 ? '#0C2D57' : 'red',
                    trailColor: '#d6d6d6',
                    backgroundColor: '#3e98c7',
                  })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default SAttendance;
