import Button from '../Button/Button.jsx';
import CardTagDisplay from '../CardTagDisplay/CardTagDisplay.jsx';
import './EventCard.css'



function EventCard({title, description, formattedDate, time, location, organization, capacity, cost}){
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
            <div className="card-content">
                <img src="/src/assets/logos/TMU.svg" alt="TMU Logo"/>

                <div className="details">
                <div className="title-bar">
                    <h3>{title}</h3>

                    <div className="title-icons">
                    <img src="/src/assets/icons/calendar.svg" alt="Calendar Icon"/>
                    <img src="/src/assets/icons/star.svg" alt="Star Icon"/>
                    </div>
                </div>

                <div className="main-details">
                    <p>{description || ""}</p>

                    <div className="detail-rows">
                    <div className="detail-cols">
                        <div className="detail-item">
                        <img src="/src/assets/icons/DateIcon.svg" alt="Date Icon"/>
                        <p>{formattedDate}</p>
                        </div>
                        <div className="detail-item">
                        <img src="/src/assets/icons/TimeIcon.svg" alt="Time Icon"/>
                        <p>{time || ""}</p>
                        </div>
                        <div className="detail-item">
                        <img src="/src/assets/icons/LocationIcon.svg" alt="Location Icon"/>
                        <p>{location || ""}</p>
                        </div>
                    </div>

                    <div className="detail-cols">
                        <div className="detail-item">
                        <img src="/src/assets/icons/CreatorIcon.svg" alt="Creator Icon"/>
                        <p>{organization || ""}</p>
                        </div>
                        <div className="detail-item">
                        <img src="/src/assets/icons/AvailabilityIcon.svg" alt="Availability Icon"/>
                        <p>{capacity || ""}</p>
                        </div>
                        <div className="detail-item">
                        <img src="/src/assets/icons/PriceIcon.svg" alt="Price Icon"/>
                        <p>{cost || ""}</p>
                        </div>
                    </div>
                    </div>
                </div>

                <CardTagDisplay 
                    tags={["Networking", "Sports", "Academics", "Testing"]}
                />

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
                </div>
            </div>
            
        </>
    );
}

export default EventCard;