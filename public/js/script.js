// Global variable to store all events
let allEvents = [];

// Loads events from json file to array
async function loadEvents() {
  try {
    const response = await fetch("/api/events");
    allEvents = await response.json();

    // Sort event by earliest
    allEvents.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });

<<<<<<< HEAD
    displayEvents(allEvents);
  } catch (error) {
    console.error("Error loading events:", error);
  }
}
=======
    // Loop through each event in json file
    loadTagFilters();
    events.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card-container";
>>>>>>> a12cc0b (Update script.js and server.js for dynamic event tags)

// Displays the event passed in
function displayEvents(eventsToRender) {
  // Get access to event-cards div
  const container = document.getElementById("event-cards");
  container.innerHTML = "";

  // Loop through each event in json file
  eventsToRender.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card-container";

    // Format time
    const dateObj = new Date(event.date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    // Mapping event details to respective elements
    card.innerHTML = `
        <div class="card-content">
          <img src="../assets/logos/TMU.svg" alt="TMU Logo">

          <div class="details">
            <div class="title-bar">
              <h3>${event.title}</h3>

              <div class="title-icons">
                <img src="../assets/icons/calendar.svg" alt="Not Added Calender Icon">
                <img src="../assets/icons/star.svg" alt="Not Favourited Icon">
              </div>
            </div>

<<<<<<< HEAD
            <div class="main-details">
              <p>${event.description}</p>

              <div class="detail-rows">
                <div class="detail-cols">
                  <div class="detail-item">
                    <img src="../assets/icons/DateIcon.svg" alt="Date Icon">
                    <p>${formattedDate}</p>
                  </div>
                  <div class="detail-item">
                    <img src="../assets/icons/TimeIcon.svg" alt="Date Icon">
                    <p>${event.time}</p>
                  </div>
                  <div class="detail-item">
                    <img src="../assets/icons/LocationIcon.svg" alt="Date Icon">
                    <p>${event.location}</p>
                  </div>
                </div>

                <div class="detail-cols">
                  <div class="detail-item">
                    <img src="../assets/icons/CreatorIcon.svg" alt="Date Icon">
                    <p>${event.organization}</p>
                  </div>
                  <div class="detail-item">
                    <img src="../assets/icons/AvailabilityIcon.svg" alt="Date Icon">
                    <p>${event.capacity}</p>
                  </div>
                  <div class="detail-item">
                    <img src="../assets/icons/PriceIcon.svg" alt="Date Icon">
                    <p>${event.cost}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="button-bar">
              <button class="btn-delete"> DELETE </button>
              <button class="btn-primary btn-more-info">More Info</button>
            </div>
=======
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p class="tickets">Only ${event.seats || 'few'} tickets left!</p>
            <button class="btn-delete"> DELETE </button>
            <button class="btn-primary btn-more-info">More Info</button>
>>>>>>> a12cc0b (Update script.js and server.js for dynamic event tags)
          </div>
        </div>
      `;

    // Add to other cards
    container.appendChild(card);
  });
}



async function loadTagFilters() {
  const filterDiv = document.getElementById("filter");
  filterDiv.innerHTML = "<h2>Event Category</h2>";

  const res = await fetch("/api/tags");
  const tags = await res.json();

  tags.forEach(tag => {
    const row = document.createElement("div");
    row.className = "selector";
    row.innerHTML = `
      <input type="checkbox" value="${tag}">
      <label>${tag}</label>
    `;
    row.querySelector("input").addEventListener("change", () => {
      loadEvents();
    });
    filterDiv.appendChild(row);
  });
}


// Initialize the load when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial load of all events
  loadEvents();

  // 2. Setup the search listener ONLY after the DOM is ready
  const searchForm = document.getElementById('search-event');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const searchTerm = e.target.title.value.toLowerCase();

      const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.organization.toLowerCase().includes(searchTerm)
      );

      displayEvents(filtered);
    });
  }
});