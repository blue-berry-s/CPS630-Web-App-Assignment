import Button from '../Button/Button.jsx';
import CardTagDisplay from '../CardTagDisplay/CardTagDisplay.jsx';
import './EventCard.css'
import { useState, useEffect} from 'react';
import { io } from "socket.io-client";



function EventCard({ id, title, description, date, time, location, organization, registeredSeatings, availableSeatings, cost, tags, isCompact, onUpdate, user  }) {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  const [registeredSeatingsDisplay, setRegisteredSeatings] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const eventPassed = new Date(date) < today;
  const token = localStorage.getItem("token"); // get token from browser
  const userId = localStorage.getItem("userId");
  const socket = io("http://localhost:8080");



  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        setRegisteredSeatings(data.registeredSeatings);
        const registeredUsers = data.registeredUsers || [];
        setIsRegistered(registeredUsers.some(u => String(u) === String(userId)));
      } catch (err) {
        console.error("Failed to fetch event", err);
      }
    };

    fetchEvent();
  }, [id, userId]);

  useEffect(() => {
  socket.on("eventUpdated", (updatedEvent) => {
    // only update THIS card if it's the same event
    if (updatedEvent.id === id) {
      setRegisteredSeatings(updatedEvent.registeredSeatings);
    }
  });

  return () => {
    socket.off("eventUpdated");
  };
}, [id]);

  // REGISTER for event
  const handleRegister = async () => {
    const endpoint = isRegistered
      ? `/api/events/unregister/${id}`
      : `/api/events/register/${id}`;

    try {
  const response = await fetch( endpoint , {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

      const data = await response.json();

      if (response.ok) {
        setRegisteredSeatings(data.registeredSeatings);
        setIsRegistered(!isRegistered); // toggle registration
        alert(isRegistered 
          ? "You have unregistered from the event" 
          : `Registered successfully! Total registered: ${data.registeredSeatings}`);

      } else {
        alert(data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. Try again.");
    }
  };

  // DELETE event
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Event "${title}" deleted successfully!`);
        if (onUpdate) onUpdate(id);
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Try again.");
    }
  };

  let newButton;
  if (eventPassed) {
    newButton = ( <Button
      buttonType="btn-disabled"
      text="PASSED EVENT"
      onClick={() => { }}
    />
    );

  } else if (isRegistered) {
    // User already registered then can unregister
    newButton = (
      <Button
        buttonType="btn-red"
        text="UNREGISTER"
        onClick={handleRegister}
      />
    );
  } else if (registeredSeatingsDisplay >= availableSeatings) {
    // Event is full
    newButton = (
      <Button
        buttonType="btn-disabled"
        text="FULL"
        onClick={() => {}}
      />
    );
  } else {
    // Event open and user not registered then can register
    newButton = (
      <Button
        buttonType="btn-yellow"
        text="REGISTER"
        onClick={handleRegister}
      />
    );
  }



  return (
    <>
      <div className={`card-content ${isCompact ? 'compact' : ''}`}>
        {!isCompact && (
          <img className="hide-on-compact" src="/src/assets/logos/TMU.svg" alt="TMU Logo" />
        )}

        <div className="details">
          <div className={`${eventPassed ? 'passedEvent' : 'currentEvent'}`} > This Event Has Passed! </div>
          <div className="title-bar">
            <h3>{title}</h3>


            {!isCompact && (
              <div className="title-icons">
                <img src="/src/assets/icons/calendar.svg" alt="Calendar Icon" />
                <img src="/src/assets/icons/star.svg" alt="Star Icon" />
              </div>
            )}
          </div>

          {!isCompact && (
            <img className="hide-on-large" src="/src/assets/logos/TMU.svg" alt="TMU Logo" />
          )}

          <p className="event-description">{description || ""}</p>

          <div className="main-details">

            <div className="detail-item">
              <img src="/src/assets/icons/DateIcon.svg" alt="Date Icon" />
              <p>{date}</p>
            </div>
            <div className="detail-item">
              <img src="/src/assets/icons/TimeIcon.svg" alt="Time Icon" />
              <p>{time || ""}</p>
            </div>
            <div className="detail-item">
              <img src="/src/assets/icons/LocationIcon.svg" alt="Location Icon" />
              <p>{location || ""}</p>
            </div>
            <div className="detail-item">
              <img src="/src/assets/icons/PriceIcon.svg" alt="Price Icon" />
              <p>{`${cost <= 0 || cost === "Free" ? "Free" : "$" + cost}` || ""}</p>
            </div>


            <div className="detail-item hide-on-compact">
              <img src="/src/assets/icons/CreatorIcon.svg" alt="Creator Icon" />
              <p>{organization || ""}</p>
            </div>
            <div className="detail-item hide-on-compact">
              <img src="/src/assets/icons/AvailabilityIcon.svg" alt="Availability Icon" />
              <p>{`${availableSeatings} spots | ${availableSeatings - registeredSeatingsDisplay} open` || ""}</p>
            </div>
          </div>

          {!isCompact && (
            <CardTagDisplay
              tags={tags || []}
            />
          )}

{!isCompact && (
  <div className="button-bar">
    {user?.role === "staff" && (
      <Button
        buttonType="btn-red"
        text="DELETE"
        onClick={handleDelete}
      />
    )}
    {newButton}
  </div>
)}
        </div>
      </div>

    </>
  );
}

export default EventCard;