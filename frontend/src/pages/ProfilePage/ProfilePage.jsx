import { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import Button from "../../components/Button/Button.jsx";

import "../../css/defaultStyle.css"
import "./ProfilePage.css";

function ProfilePage({ setPage, user }) {
  const [selectedEvents, setSelectedEvents] = useState("upcoming");

  window.onload = function () {
    document.getElementById('upcoming-events').focus();
  };

  return (
    <>
      <Header setPage={setPage} />
      <h2 id="title">My Profile</h2>

      <div id="section">

        <div id="profile">
          <div id="profile-info">
            <img src="/src/assets/icons/profile.svg" alt="Profile Picture" />
            <h3 id="name">{user?.name || "Loading..."}</h3>
            <p id="accountType">{user?.role || "Loading..."}</p>

            <div id="numOfEvents">
              <p>Number of Events Registered:</p>
              <p>80</p>
            </div>
            
            <div id="more-info">
              <h3>Info</h3>
              <p>Name: {user?.name || "Loading..."}</p>
             <p> Major: {user?.role === "student" ? user.major : "N/A"} </p>
              <p>Email: {user?.email || "Loading..."}</p>
              </div>
          </div>

          <div className="profile-button">
           {user?.role === "staff" && ( 
            <Button 
            text="Add Event"
            buttonType="btn-blue"
            onClick={() => { setPage("addEvent"); }}
            />
          )}
            <Button text="View All Event" buttonType="btn-blue" onClick={() => { setPage("home"); }} />
            <Button text="View Map" buttonType="btn-blue" onClick={() => { setPage("campusMap"); }} />
          </div>
        </div>

        <div id="events-section">
          <div id="event-heading">
            <button
              type="button"
              className={`header-button ${selectedEvents === "upcoming" ? "active" : ""}`}
              onClick={() => setSelectedEvents("upcoming")}
            >
              <h2>My Upcoming Events</h2>
            </button>

            <button
              type="button"
              className={`header-button ${selectedEvents === "past" ? "active" : ""}`}
              onClick={() => setSelectedEvents("past")}
            >
              <h2>Past Events</h2>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default ProfilePage;