import React, { useState, useEffect } from "react";
import "./Filter.css";
import SearchIcon from "../../assets/icons/SearchIcon.svg";
import SearchDateIcon from "../../assets/icons/SearchDateIcon.svg";
import Button from "../Button/Button";

function Filter({ className, setPage, selectedTags, setSelectedTags, searchTitle, setSearchTitle }) {
  const [title, setTitle] = useState(searchTitle || ""); // ADDED
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [tags, setTags] = useState([]);
  const [notice, setNoticeState] = useState(null);

  useEffect(() => {
    async function displayTags() {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) throw new Error("Server returned status " + res.status);

        const allTags = await res.json();
        setTags(
          Array.isArray(allTags)
            ? allTags.filter(tag => tag && tag.trim() !== "")
            : []
        );
      } catch (err) {
        console.error("Could not load tags:", err);
      }
    }

    displayTags();
  }, []);

  const handleTagChange = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // ADDED
  const handleSearchTitle = (e) => {
    e.preventDefault();
    setSearchTitle(title);
  };

  const handleSearchDate = (e) => e.preventDefault();

  return (
    <div className={className} id="filter">
      {/* Buttons */}
      <div className="button-row">
        <Button text="Add Event" buttonType="btn-blue" onClick={() => { setPage("addEvent"); console.log("Switch to add Event"); }} />
        <Button text="View Map" buttonType="btn-blue" onClick={() => { setPage("campusMap"); console.log("Switch to campus Map"); }} />
      </div>

      {/* Notice Section */}
      {notice && (
        <div id="notice" className={notice.className} style={{ display: "flex" }}>
          <span id="noticeType">{notice.type}</span>
          <span id="noticeInfo">{notice.info}</span>
        </div>
      )}

      {/* Filters Section */}
      <h2 className="section-title">Filters</h2>

      <form id="search-event" onSubmit={handleSearchTitle}>
        <div className="input-with-icon">
          <input
            type="text"
            name="title"
            placeholder="Search (name or description)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}   // still your state
          />
          <button type="submit" className="icon-button">
            <img src={SearchIcon} alt="Search" />
          </button>
        </div>
      </form>

      {/* Event Date Section */}
      <h2 className="section-title">Event Date</h2>
      <div id="date-filter">
        <form id="search-date" onSubmit={handleSearchDate}>
          <label htmlFor="from-date">From: </label>
          <div className="input-with-icon">
            <input
              type="date"
              id="from-date"
              name="from-date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => console.log("Search From Date")}
            >
              <img src={SearchDateIcon} alt="Search From Date" />
            </button>
          </div>

          <label htmlFor="to-date">To: </label>
          <div className="input-with-icon">
            <input
              type="date"
              id="to-date"
              name="to-date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => console.log("Search To Date")}
            >
              <img src={SearchDateIcon} alt="Search To Date" />
            </button>
          </div>
        </form>
      </div>

      {/* Tags Section */}
      <h2 className="section-title">Event Category</h2>
      <div id="tagsContainer">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <div key={tag} className="selector">
              <input
                type="checkbox"
                id={tag}
                name="eventTags"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              <label htmlFor={tag}>{tag}</label>
            </div>
          ))
        ) : (
          <p>No Tags Loaded</p>
        )}
      </div>
    </div>
  );
}

export default Filter;