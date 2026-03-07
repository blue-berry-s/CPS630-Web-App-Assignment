import { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import EventCard from "../../components/EventCard/EventCard.jsx";
import "../../css/defaultStyle.css"
import "./Home.css";


function Home({ setPage }) {
  const [events, setEvents] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const refreshEvents = (deletedId) => {
    setEvents(prev => prev.filter(event => event._id !== deletedId));
  };

  useEffect(() => {
    fetch('/api/events?all=true')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  console.log("selectedTags:", selectedTags);
  console.log("events:", events);
  return (
    <div>
      <Header setPage={setPage} />
      <Filter className="hide-on-large" setPage={setPage} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
      <section id="upcoming-events">
        <h1>Upcoming Events</h1>

        <div id="event-display">
          <div id="event-cards">
            {events
              .filter((event) =>
                selectedTags.length === 0 ||
                (Array.isArray(event.tags) &&
                  event.tags.some((tag) =>
                    selectedTags.some((selectedTag) =>
                      String(tag).trim().toLowerCase() === selectedTag.trim().toLowerCase()
                    )
                  ))
              )
              .map((event, idx) => (
                <EventCard
                  key={idx}
                  id={event._id}
                  onUpdate={refreshEvents}
                  {...event}
                />
              ))}
          </div>
          <Filter className="hide-on-compact hide-on-medium" setPage={setPage} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </div>
      </section>
    </div>
  );
}

export default Home;