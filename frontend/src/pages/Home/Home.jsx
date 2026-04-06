import { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import Filter from "../../components/Filter/Filter.jsx";
import EventCard from "../../components/EventCard/EventCard.jsx";
import Button from "../../components/Button/Button.jsx";

import TMUSplashImage from '../../assets/photos/TMUSplashImage.png';
import TMUGroupStudents from '../../assets/photos/TMUGroupStudents.png'
import SearchIcon from "../../assets/icons/SearchIcon.svg";

import "../../css/defaultStyle.css"
import "./Home.css";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function Home({ setPage }) {
  const [events, setEvents] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [title, setTitle] = useState("");


  const refreshEvents = (deletedId) => {
    setEvents(prev => prev.filter(event => event._id !== deletedId));
  };

  useEffect(() => {
    fetch('/api/events?all=true')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);


  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  // console.log("selectedTags:", selectedTags);
  // console.log("events:", events);

  return (
    <div>
      <Header setPage={setPage} />

      <Filter
        className="hide-on-large"
        setPage={setPage}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
      />

      <div id="hero-landing">
        <img src={TMUSplashImage} alt="Photo of TMU Student Learning Center Building" />
        <div>
          <h1>Stay Connected To Your <span> Student Life </span></h1>

          <form id="search-all-event">
            <div className="input-with-icon">
              <input
                type="text"
                name="title"
                placeholder="Search (name or description)"
                value={title}
                onChange={(e) => { }}
              />
              <button type="submit" className="icon-button">
                <img src={SearchIcon} alt="Search" />
              </button>
            </div>
          </form>

          {/* Buttons */}
          <div className="button-row">
            <Button text="Add Event" buttonType="btn-blue" onClick={() => { setPage("addEvent"); console.log("Switch to add Event"); }} />
            <Button text="View Map" buttonType="btn-blue" onClick={() => { setPage("campusMap"); console.log("Switch to campus Map"); }} />
          </div>

        </div>
      </div>

      <section id="popular-events">

        <h1>Popular Events</h1>


        <Carousel
          showDots={true}
          infinite={true}
          responsive={responsive}
          centerMode={true}
          itemClass={"carousel-cards"}
        >
          <EventCard title="Test1" />
          <EventCard title="Test2" />
          <EventCard title="Test3" />
        </Carousel>;

      </section>

      <section id="add-events">
        <h1> Missing an Event?</h1>
        <div id="text-content">
          <div id="text-and-button">
            <p> Hosting a guest speaker, a club social, or a department workshop that isn't on the list? We want to make sure every corner of TMU campus life is represented. By sharing your event on our platform, you’re not just filling a slot on the calendar; you’re helping students discover new passions and build a stronger, more connected community across our downtown campus. </p>
            <p> Adding your event is quick and easy. Simply click the button below to provide the essential details—like date, time, and location—to ensure your session gets the visibility it deserves. Whether it’s a small study group in the SLC or a major competition at the Mattamy Athletic Centre, get your event on the map and start reaching more students today! </p>
            <div>
              <Button text="Add Event" buttonType="btn-blue" onClick={() => { setPage("addEvent"); console.log("Switch to add Event"); }} />
            </div>
          </div>

          <div id="student-img">
            <img src={TMUGroupStudents} alt="Group of students smiling" />
          </div>
        </div>

      </section>

      <section id="upcoming-events">
        <h1>Upcoming Events</h1>

        <div id="event-display">
          <div id="event-cards">
            {events
              .filter((event) =>
                (
                  selectedTags.length === 0 ||
                  (Array.isArray(event.tags) &&
                    event.tags.some((tag) =>
                      selectedTags.some((selectedTag) =>
                        String(tag).trim().toLowerCase() === selectedTag.trim().toLowerCase()
                      )
                    ))
                )
                &&
                (
                  searchTitle === "" ||
                  new RegExp(`\\b${searchTitle.toLowerCase()}\\b`, "i").test(event.title || "") ||
                  new RegExp(`\\b${searchTitle.toLowerCase()}\\b`, "i").test(event.description || "")
                )
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

          <Filter
            className="hide-on-compact hide-on-medium"
            setPage={setPage}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            searchTitle={searchTitle}
            setSearchTitle={setSearchTitle}
          />
        </div>
      </section>
    </div>
  );
}

export default Home;