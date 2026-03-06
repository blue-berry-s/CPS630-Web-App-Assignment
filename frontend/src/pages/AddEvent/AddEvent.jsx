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

import { useState, useEffect } from "react";

function AddEvent({ setPage }) {
  const [registrationRequired, openRegistration] = useState(true);
  const [tags, setTags] = useState([]);

  const buildings = [
    "TRS", "SLC", "LIB", "POD",
    "JOR", "KHB", "RAC", "RCC",
    "ENG", "EPH", "MAC", "DSQ"
  ];

  useEffect(() => {
    async function displayTags() {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) throw new Error("Server returned status " + res.status);

        const allTags = await res.json();
        setTags(Array.isArray(allTags) ? allTags : []);
      } catch (err) {
        console.error("Could not load tags:", err);
      }
    }

    displayTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title: document.getElementById('eventName').value,
      description: document.getElementById('eventDesc').value,
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value,
      location: document.getElementById('eventBuilding').value,
      organization: document.getElementById('eventCreator').value,
      cost: document.getElementById('eventPrice').value,
      tags: Array.from(document.querySelectorAll('#tagsContainer input:checked'))
        .map(el => el.nextSibling.textContent.trim()),
      capacity: document.getElementById('eventSeats').value
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert("Event added successfully!");
        setPage('home');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  return (
    <>
      <Header setPage={setPage} />
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
              <label className="upload-button">
                <img src={FileIcon} alt="File" />
                <img src={DriveIcon} alt="Drive" />
                <img src={DropboxIcon} alt="Dropbox" />
                <input type="file" id="eventImage" name="eventImage" accept="image/png, image/jpg, image/svg+xml" hidden />
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="section-label">Information</div>

            <div className="section-content">
              <div>
                <label>Event Name</label>
                <input type="text" placeholder="Event Name" name="eventName" id="eventName" required />
              </div>

              <div className="two-column">
                <div>
                  <label>Creator</label>
                  <input type="text" placeholder="Event Creator" name="eventCreator" id="eventCreator" required />
                </div>

                <div>
                  <label>Date</label>
                  <input type="date" name="eventDate" id="eventDate" required />
                </div>
              </div>

              <div>
                <label>Event Description</label>
                <textarea placeholder="A short description of the event here..." id="eventDesc" name="eventDesc" rows="5" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-label">Details</div>

            <div className="section-content">

              <div className="two-column">

                <div className="input-with-icon">
                  <img id="dropDown" src={DropDownArrow} />
                  <img src={BuildingIcon} alt="Building" className="input-icon" />
                  <select className="uniform-input" defaultValue="" id="eventBuilding" name="eventBuilding">
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

                <input type="text" placeholder="Location" name="eventLocation" id="eventLocation" />

              </div>

              <div className="input-with-icon">
                <img src={CostIcon} alt="Cost" />
                <input type="number" placeholder="Cost" name="eventPrice" id="eventPrice" />
              </div>

              <div className="input-with-icon">
                <img src={TimeIcon} alt="Time" />
                <input type="text" placeholder="Time" name="eventTime" id="eventTime" />
              </div>

              <div className="input-with-icon">
                <img src={SeatIcon} alt="Seats" />
                <input type="number" placeholder="Seats" name="eventSeats" id="eventSeats" />
              </div>

            </div>
          </div>

          <div className="form-section">
            <div className="section-label">Tags</div>

            <div id="tagsContainer" className="section-content tags-grid">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <label key={tag}>
                    <input type="checkbox" /> {tag}
                  </label>
                ))
              ) : (
                <p>No Tags Loaded</p>
              )}
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
                    <input type="radio" id="registrationTrue" name="regRequired" value="yes" defaultChecked onClick={() => openRegistration(true)} />
                    <span>Yes</span>
                  </label>

                  <label className="radio-option">
                    <input type="radio" id="registrationFalse" name="regRequired" value="no" onClick={() => openRegistration(false)} />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className={`registration-row ${registrationRequired ? "show_registration" : "hide_registration"}`}>
                <span className="registration-title">Registration Opens</span>

                <div className="radio-options">
                  <label className="radio-option">
                    <input type="radio" name="regOpen" value="today" id="dateToday" defaultChecked />
                    <span>Today</span>
                  </label>
                </div>

                <div className="radio-options">
                  <label className="radio-option">
                    <input type="radio" name="regOpen" value="dateOther" id="dateOther" />
                    <input type="date" className="uniform-input" id="registrationDateDate" />
                  </label>
                </div>
              </div>

              <div className={`registration-row column ${registrationRequired ? "show_registration" : "hide_registration"}`}>
                <label className="registration-title">Registration Link</label>
                <input
                  type="text"
                  placeholder="https://www.example.com/"
                  className="uniform-input"
                  id="registrationLink" name="registrationLink"
                />
              </div>

            </div>
          </div>

          <div className="button-row">
            <Button buttonType="btn-white" text="Cancel" onClick={() => setPage('home')} />
            <Button buttonType="btn-blue" text="Submit" onClick={handleSubmit} />
          </div>

        </div>
      </div >
    </>
  );
}

export default AddEvent;