import { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import EventCard from "../../components/EventCard/EventCard.jsx";
import "../../css/defaultStyle.css"
import "./Home.css";


function Home({ setPage }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <Header setPage={setPage} />
      <Filter className="hide-on-large" setPage={setPage} />
      <section id="upcoming-events">
        <h1>Upcoming Events</h1>

        <div id="event-display">
          <div id="event-cards">
            {events.map((event, idx) => (
              <EventCard key={idx} {...event} />
            ))}
          </div>
          <Filter className="hide-on-compact hide-on-medium" setPage={setPage} />
        </div>
      </section>
    </div>
  );
}

export default Home;