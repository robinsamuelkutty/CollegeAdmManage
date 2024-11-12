import React from "react";
import MNavBar from "../../../Components/MNavBar/MNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import "../SelectSeries/SelectSeries.css"
import Footer from "../../../Components/Footer/Footer";
function SelectTestforMark() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, course, department, className, subject  } = location.state || {};

  console.log("user", user);


  const handleNavigateSeries=(testName)=>{
    navigate("/viewMark",{state:{user, course, department, className, subject,testName}})
  }
  return (
    <>
      <MNavBar user={user?.teacher} />
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
      <div className="selectSeries">
      
      {!subject && (
          <div className="error-message" style={{marginLeft:"0px",fontWeight:"bold"}}>
            *Subject is not selected. Please select the subject.
          </div>
        )}
        <h5>Select a Test Series</h5>
        <div className="selectTest">
          <div className="scardt" onClick={()=>handleNavigateSeries("1st Series")}>
                <h3><span><strong>1st</strong></span><br/> Series</h3>
          </div>
          <div className="scardt" onClick={()=>handleNavigateSeries("2nd Series")}>
                <h3><span><strong>2nd</strong></span><br/> Series</h3>
          </div>
          <div className="scardt" onClick={()=>navigate("/viewInternalMark",{state:{user, course, department, className, subject,testName:"Internal Mark"}})}>
                <h3>Internal Mark</h3>
          </div>
          <div className="scardt" onClick={()=> navigate("/viewMarkforLab",{state:{user, course, department, className, subject,testName:"Lab"}})}>
                <h3 style={{fontSize:"28px"}}>Lab Internal Mark</h3>
          </div>
          
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default SelectTestforMark;
