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

    displayEvents(allEvents);
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

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
          </div>
        </div>
      `;

    // Add to other cards
    container.appendChild(card);
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