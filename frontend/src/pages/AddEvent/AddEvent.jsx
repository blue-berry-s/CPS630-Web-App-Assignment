import React from "react";
import "../../css/defaultStyle.css"
import Header from "../../components/Header/Header.jsx";
import Button from "../../components/Button/Button.jsx";
import "./AddEvent.css";

import FileIcon from "../../assets/icons/File.svg";
import DriveIcon from "../../assets/icons/Drive.svg";
import DropboxIcon from "../../assets/icons/Dropbox.svg";
import BuildingIcon from "../../assets/icons/LocationIcon.svg";
import CostIcon from "../../assets/icons/PriceIcon.svg";
import SeatIcon from "../../assets/icons/SmileIcon.svg";
import TimeIcon from "../../assets/icons/TimeIcon.svg";
import DropDownArrow from "../../assets/icons/DropDownArrow.svg";

function AddEvent({setPage}) {
  const buildings = [
    "TRS", "SLC", "LIB", "POD",
    "JOR", "KHB", "RAC", "RCC",
    "ENG", "EPH", "MAC", "DSQ"
  ];
  return (
      <>
       <Header setPage={setPage}/>
      <div className="topText">
        <h1>Add an Event!</h1>
        <p>Description Text here about adding events - follow the form and whatever blah blah blah don’t need to read that much this is so much 
          fun writing filler text yadayadayada</p>
      </div>

      <div className="add-event-container">
        <div className="form-card">

          <h2 className="form-title">NEW EVENT FORM</h2>

          <div className="image-upload-box">
            <h3>Upload an Event Image</h3>
            <div className="upload-icons">
              <label><img src={FileIcon} alt="File" /><input type="file" hidden /></label>
              <label><img src={DriveIcon} alt="Drive" /><input type="file" hidden /></label>
              <label><img src={DropboxIcon} alt="Dropbox" /><input type="file" hidden /></label>
            </div>
          </div>

          <div className="form-section">
            <div className="section-label">Information</div>

            <div className="section-content">
              <label>Event Name</label>
              <input type="text" placeholder="Event Name" />

              <div className="two-column">
                <div>
                  <label>Creator</label>
                  <input type="text" placeholder="Event Creator" />
                </div>

                <div>
                  <label>Date</label>
                  <input type="date" />
                </div>
              </div>

              <label>Event Description</label>
              <textarea placeholder="A short description of the event here..." />
            </div>
          </div>

          <div className="form-section">
           <div className="section-label">Details</div>

           <div className="section-content">
         
             <div className="two-column">
         
             <div className="input-with-icon">
            <img id="dropDown" src={DropDownArrow}/>
             <img src={BuildingIcon} alt="Building" className="input-icon" />
              <select className="uniform-input" defaultValue="">
                <option value="" disabled>
                  Building
                </option>
                {buildings.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
         
               <input type="text" placeholder="Location" />
         
             </div>
         
             <div className="input-with-icon">
               <img src={CostIcon} alt="Cost" />
               <input type="text" placeholder="Cost" />
             </div>
         
             <div className="input-with-icon">
               <img src={TimeIcon} alt="Time" />
               <input type="text" placeholder="Time" />
             </div>
         
             <div className="input-with-icon">
               <img src={SeatIcon} alt="Seats" />
               <input type="text" placeholder="Seats" />
             </div>
         
           </div>
         </div>
         
          <div className="form-section">
            <div className="section-label">Tags</div>

            <div className="section-content tags-grid">
              <label><input type="checkbox" /> Academics</label>
              <label><input type="checkbox" /> Sports</label>
              <label><input type="checkbox" /> Network</label>
              <label><input type="checkbox" /> Clubs</label>
              <label><input type="checkbox" /> Arts</label>
              <label><input type="checkbox" /> Fashion</label>
              <label><input type="checkbox" /> Other</label>
            </div>
          </div>

          <div className="divider" />

          <div className="form-section">
          <div className="section-label">Registration</div>
          
          <div className="section-content registration-section">
          
            <div className="registration-row">
              <span className="registration-title">Requires External Registration?</span>
          
              <div className="radio-options">
                <label className="radio-option">
                  <input type="radio" name="regRequired" value="yes" />
                  <span>Yes</span>
                </label>
          
                <label className="radio-option">
                  <input type="radio" name="regRequired" value="no" />
                  <span>No</span>
                </label>
              </div>
            </div>
          
            <div className="registration-row">
              <span className="registration-title">Registration Opens</span>
          
              <div className="radio-options">
                <label className="radio-option">
                  <input type="radio" name="regOpen" value="today" />
                  <span>Today</span>
                </label>
          
                <input type="date" className="uniform-input" />
              </div>
            </div>
          
            <div className="registration-row column">
              <label className="registration-title">Registration Link</label>
              <input
                type="text"
                placeholder="https://www.example.com/"
                className="uniform-input"
              />
            </div>
          
          </div>
        </div>

          <div className="button-row">
            <Button buttonType="btn-white" text="Cancel" />
            <Button buttonType="btn-blue" text="Submit" />
          </div>

        </div>
      </div>
    </>
  );
}

export default AddEvent;