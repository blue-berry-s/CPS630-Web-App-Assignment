import React from "react";
import Header from "../../components/Header/Header.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import EventCard from "../../components/EventCard/EventCard.jsx";
import "../../css/defaultStyle.css"
import "./Home.css";


function Home({ setPage }) {
  // Sample events for now
  const events = [
    {
      title: "Sample Event",
      description: "This is a test event",
      formattedDate: "2026-03-05",
      time: "12:00 PM",
      location: "Toronto",
      organization: "TMU",
      capacity: "100",
      cost: "$20"
    },
    {
      title: "Networking Meetup",
      description: "Meet students and professionals",
      formattedDate: "2026-03-10",
      time: "6:00 PM",
      location: "Toronto",
      organization: "TMU Club",
      capacity: "50",
      cost: "$10"
    }
  ];

  return (
    <div>
      <Header setPage={setPage}/>
      <Filter className="hide-on-large" setPage={setPage}/>
      <section id="upcoming-events">
        <h1>Upcoming Events</h1>

        <div id="event-display">
          <div id="event-cards">
            {events.map((event, idx) => (
              <EventCard key={idx} {...event} />
            ))}
          </div>
          <Filter className="hide-on-compact hide-on-medium" setPage={setPage}/>
        </div>
      </section>
    </div>
  );
}

export default Home;