import React, { useState } from 'react';
import MNavBar from '../../../Components/MNavBar/MNavBar';
import Footer from '../../../Components/Footer/Footer';
import "./CreateQuestion.css";
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../../images/titleLogo.png";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function CreateQuestion() {
    const location = useLocation();
    const { user, course, department, className, subject } = location.state || {};
    const navigate = useNavigate();
    const [showQuestionPopup, setShowQuestionPopup] = useState(false);
    const [showSectionPopup, setShowSectionPopup] = useState(false);
    const [content, setContent] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const getSemesterName = (className) => {
        switch (className) {
            case 'S1':
                return 'Semester 1';
            case 'S2':
                return 'Semester 2';
            case 'S3':
                return 'Semester 3';
            case 'S4':
                return 'Semester 4';
            case 'S5':
                return 'Semester 5';
            case 'S6':
                return 'Semester 6';
            case 'S7':
                return 'Semester 7';
            case 'S8':
                return 'Semester 8';
            default:
                return 'Unknown Semester';
        }
    };
    const handleAddQuestion = (question) => {
        setContent([...content, { type: 'question', data: question }]);
        setShowQuestionPopup(false);
        setImagePreview(null); // Reset image preview after adding the question
    };

    const handleAddSection = (sectionName) => {
        setContent([...content, { type: 'section', data: sectionName }]);
        setShowSectionPopup(false);
    };

    const handleDeleteLast = () => {
        setContent(content.slice(0, -1));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result); // Set the preview of the image
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };
    const exportToPDF = () => {
        // Temporarily add a class to hide borders
        const headerSection = document.querySelector('.headerSection');
        headerSection.classList.add('hide-borders');
    
        const input = document.querySelector('.quespaper'); // The div you want to export
    
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            
            // Calculate the dimensions and scale
            const pdf = new jsPDF('portrait', 'mm', 'a4'); // Set format to A4
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            
            const scaledWidth = imgWidth * ratio;
            const scaledHeight = imgHeight * ratio;
            
            pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
            pdf.save(`QuestionPaper-${subject.subName}-${className}.pdf`);
    
            // Remove the class after exporting
            headerSection.classList.remove('hide-borders');
        }).catch((error) => {
            console.error('Error generating PDF:', error);
    
            // Remove the class in case of an error
            headerSection.classList.remove('hide-borders');
        });
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
            <div className='createQues'>
            {!subject && (
          <div className="error-message" style={{marginLeft:"0px",fontWeight:"bold"}}>
            *Subject is not selected. Please select the subject.
          </div>
        )}
            <p className='desktop-view-message'>For a better experience, please switch to desktop view.</p>
                <div className="quespaper">
                    <div className='headerSection'>
                        <div className="headerTop">
                            <div className="registerInfo">
                                <span>Register No.: ................................................</span>
                                <span style={{marginLeft:"270px"}}>Name: ....................................................</span>
                            </div>
                        </div>
                        <div style={{border:" 1px solid #000"}}>
                            <div className="headerMain">
                                <div className="logoSection">
                                    <img src={logo} alt="College Logo" />
                                </div>
                                <div className="collegeInfo">
                                    <h1>College of Engineering Poonjar</h1>
                                </div>
                            </div>

                            <div className="headerDetails">
                                <div className="detailsRow">
                                    <span>{course} in {department}</span>
                                    <span>Branch: Department of {department}</span>
                                </div>
                                <div className="detailsRow">
                                    <span>Semester: {getSemesterName(className)}</span>
                                    <span>Academic Year: <AcademicYearSelector /></span>
                                </div>
                                <div className="detailsRow">
                                    <span>Course Code & Course Name: {subject.subName}</span>
                                </div>
                                <div className="detailsRow">
                                    <span>
                                        Time: <input style={{width:"80px"}} type="text" placeholder="Hrs." />
                                    </span>
                                    <span>
                                        <input type="text" placeholder="Exam Type" />
                                    </span>
                                    <span>Date: <input style={{width:"120px"}} type="text" placeholder="dd/mm/yyyy" /> </span>
                                    <span>Maximum Mark: <input style={{width:"50px"}} type="text" placeholder="mark" /></span>
                                </div>
                            </div>
                        </div>
                        <div className='commonAlso' style={{marginTop:"10px"}}>
                            <span>No.</span>
                            <span  style={{marginLeft:"280px"}}>Question</span>
                            <span style={{marginLeft:"275px"}}>Mark</span>
                            <span style={{marginLeft:"50px"}}>ML</span>
                        </div>
                    </div>
                    <div className='paperMainPart'>
                        {content.map((item, index) => (
                            item.type === 'section' ? (
                                <div key={index} className="section" style={{marginTop:"25px"}}>
                                    <h3>{item.data}</h3>
                                </div>
                            ) : (
                                <div key={index} className="question" style={{marginTop:"10px"}}>
                                    <span style={{float:"left"}}>{item.data.qnNo}.</span>
                                    <div style={{width:"560px",float:"left",marginLeft:"10px"}}>
                                        <span>{item.data.question}</span>
                                        {item.data.image && <img src={item.data.image} alt="Uploaded" style={{maxWidth: "100%", marginTop: "10px"}} />}
                                    </div>
                                    <span style={{marginLeft:"50px"}}>{item.data.mark}</span>
                                    <span style={{marginLeft:"40px"}}>{item.data.module}</span>
                                </div>
                            )
                        ))}
                    </div>
                    <div style={{height:'100px'}}>


                    </div>
                </div>
                <div className='operatePart' style={{marginTop:"40px"}}>
                    <button className='save-btn' onClick={() => setShowQuestionPopup(true)}>Add New Question</button>
                    <button className='save-btn' style={{background:"#FFAA1D"}} onClick={() => setShowSectionPopup(true)}>Add New Section</button>
                    <button className='save-btn' style={{background:"crimson"}}  onClick={handleDeleteLast}>Delete the Last One</button>
                </div>
                <button className='takeAttendence-btn'  onClick={exportToPDF}>Export as PDF</button>
            </div>
            <Footer />

            {/* Question Popup */}
            {showQuestionPopup && (
                <div className="popUp">
                    <div className="popupContent">
                        <h3>Add New Question</h3>
                        <input type="text" placeholder="Qn No." id="qnNo" />
                        <textarea type="text" placeholder="Question" id="question" />
                        <input type="text" placeholder="Mark" id="mark" />
                        <input type="text" placeholder="Module" id="module" />
                        <input type="file" onChange={handleImageUpload} accept="image/*" />
                        {imagePreview && <img src={imagePreview} alt="Preview" style={{maxWidth: "100%", marginTop: "10px"}} />}
                        <button
                            onClick={() => {
                                const qnNo = document.getElementById('qnNo').value;
                                const question = document.getElementById('question').value;
                                const mark = document.getElementById('mark').value;
                                const module = document.getElementById('module').value;
                                handleAddQuestion({ qnNo, question, mark, module, image: imagePreview });
                            }}
                        >
                            Add Question
                        </button>
                        <button onClick={() => setShowQuestionPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Section Popup */}
            {showSectionPopup && (
                <div class="popUp">
                    <div class="popupContent">
                        <h3>Add New Section</h3>
                        <input type="text" placeholder="Section Name" id="sectionName" />
                        <button
                            onClick={() => {
                                const sectionName = document.getElementById('sectionName').value;
                                handleAddSection(sectionName);
                            }}
                        >
                            Add Section
                        </button>
                        <button onClick={() => setShowSectionPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

const AcademicYearSelector = () => {
    const [selectedYear, setSelectedYear] = useState('2023-24');

    const handleChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const academicYears = [
        '2022-23',
        '2023-24',
        '2024-25',
        '2025-26',
        '2026-27',
        '2027-28',
        '2028-29',
        '2029-30',
        '2030-31'
    ];

    return (
        <select id="academic-year" value={selectedYear} onChange={handleChange}>
            {academicYears.map((year) => (
                <option key={year} value={year}>
                    {year}
                </option>
            ))}
        </select>
    );
};

export default CreateQuestion;
