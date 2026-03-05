import Button from '../Button/Button.jsx';
import CardTagDisplay from '../CardTagDisplay/CardTagDisplay.jsx';
import './EventCard.css'



function EventCard({ title, description, date, time, location, organization, availableSeatings, cost, isCompact }) {
  // REGISTER for event
  const handleRegister = async () => {
    try {
      const response = await fetch(`/api/events/register/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Registered successfully! Total registered: ${data.registeredSeatings}`);
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
      const response = await fetch(`/api/events/${_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Event "${title}" deleted successfully!`);
        // Optional: remove card from UI or trigger parent refresh
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed. Try again.");
    }
  };


  return (
    <>
      <div className={`card-content ${isCompact ? 'compact' : ''}`}>
        {!isCompact && (
          <img className="hide-on-compact" src="/src/assets/logos/TMU.svg" alt="TMU Logo" />
        )}

        <div className="details">
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
              <p>{cost || ""}</p>
            </div>


            <div className="detail-item hide-on-compact">
              <img src="/src/assets/icons/CreatorIcon.svg" alt="Creator Icon" />
              <p>{organization || ""}</p>
            </div>
            <div className="detail-item hide-on-compact">
              <img src="/src/assets/icons/AvailabilityIcon.svg" alt="Availability Icon" />
              <p>{availableSeatings || ""}</p>
            </div>
          </div>

          {!isCompact && (
            <CardTagDisplay
              tags={["Networking", "Sports", "Academics", "Testing"]}
            />
          )}

          {!isCompact && (
            <div className="button-bar">
              <Button
                buttonType="btn-red"
                text="DELETE"
                onClick={handleDelete}
              />
              <Button
                buttonType="btn-yellow"
                text="REGISTER"
                onClick={handleRegister}
              />
            </div>
          )}
        </div>
      </div>

    </>
  );
}

export default EventCard;