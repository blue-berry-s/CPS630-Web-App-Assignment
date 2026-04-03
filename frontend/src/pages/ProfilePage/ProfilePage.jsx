import { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Button from "../../components/Button/Button.jsx";

import "../../css/defaultStyle.css"
import "./ProfilePage.css";

function ProfilePage({ setPage, user }) {
  const [selectedEvents, setSelectedEvents] = useState("upcoming");
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
  document.getElementById("upcoming-events")?.focus();
}, []);

useEffect(() => {
  const fetchRegisteredEvents = async () => {
    try {
      const res = await fetch("/api/events?all=true");
      const data = await res.json();

      const myEvents = data.filter(event =>
        Array.isArray(event.registeredUsers) &&
        event.registeredUsers.some(id => String(id) === String(user?._id))
      );

      setRegisteredEvents(myEvents);
    } catch (err) {
      console.error("Failed to load registered events:", err);
    }
  };

  if (user?._id) {
    fetchRegisteredEvents();
  }
}, [user]);

let today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingEvents = registeredEvents.filter(
  event => new Date(event.date) >= today
);

const pastEvents = registeredEvents.filter(
  event => new Date(event.date) < today
);

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
              <p>{registeredEvents.length}</p>
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

  <div id="upcoming-events" tabIndex="-1">
    {(selectedEvents === "upcoming" ? upcomingEvents : pastEvents).length === 0 ? (
      <p>No events found.</p>
    ) : (
      (selectedEvents === "upcoming" ? upcomingEvents : pastEvents).map((event) => (
        <div key={event.id} className="profile-event-card">
          <h3>{event.title}</h3>
          <p>{event.date}</p>
          <p>{event.time}</p>
          <p>{event.location}</p>
        </div>
      ))
    )}
  </div>
</div>

      </div>
    </>
  );
}

export default ProfilePage;