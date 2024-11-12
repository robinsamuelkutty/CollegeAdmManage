import React from "react";
import MNavBar from "../../../Components/MNavBar/MNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import "../../Teacher/SelectSeries/SelectSeries.css"
import Footer from "../../../Components/Footer/Footer";

function SelectTestStudent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  console.log("user", user);


  const handleNavigateSeries=(testName)=>{
    navigate("/studentMark",{state:{user,testName}})
  }
  return (
    <>
      <MNavBar user={user.student} />
      <div className="zxc">
        <button
          className="back-btn"
          onClick={() =>
            navigate("/student", {
              state: { user },
            })
          }
        >
          Back
        </button>
      </div>
      <div className="selectSeries">
        <h5>Select a Test Series</h5>
        <div className="selectTest">
          <div className="scardt" onClick={()=>handleNavigateSeries("1st Series")}>
                <h3><span><strong>1st</strong></span><br/> Series</h3>
          </div>
          <div className="scardt" onClick={()=>handleNavigateSeries("2nd Series")}>
                <h3><span><strong>2nd</strong></span><br/> Series</h3>
          </div>
          <div className="scardt" onClick={()=>navigate("/studentInternalMark",{state:{user}})}>
                <h3>Internal Mark</h3>
          </div>
          <div className="scardt" onClick={()=>navigate("/studentLabInternalMark",{state:{user}})}>
                <h3 style={{fontSize:"28px"}}>Lab Internal Mark</h3>
          </div>
          
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default SelectTestStudent;