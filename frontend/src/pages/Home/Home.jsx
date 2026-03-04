import React from "react";
import Header from "../../components/Header/Header.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import EventCard from "../../components/EventCard/EventCard.jsx";

function Home() {
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
      <Header />
      <section id="upcoming-events">
        <h2>Upcoming Events</h2>

        <div id="event-display">
          <div id="event-cards">
            {events.map((event, idx) => (
              <EventCard key={idx} {...event} />
            ))}
          </div>
          <Filter />
        </div>
      </section>
    </div>
  );
}

export default Home;