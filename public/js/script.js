
// Store events in a global array so we can filter them
let allEvents = [];

// Load all events from the backend and display them
async function loadEvents() {
  try {
    // Ask the server for all events
    const response = await fetch("/api/events");
    allEvents = await response.json();

    // Sort events by date (earliest first)
    allEvents.sort((a, b) => a.date.localeCompare(b.date));

    // Show events on the page
    displayEvents(allEvents);

    // Build the tag filter list on the right
    loadTagFilters();
    searchFilter();
    dateFilter();
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

// Display a list of events inside the #event-cards div
function displayEvents(eventsToRender) {
  const container = document.getElementById("event-cards");
  if (!container) return;

  // Clear existing cards
  container.innerHTML = "";

  // Build a card for each event
  eventsToRender.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card-container";

    // Make the date look nicer
    const formattedDate = new Date(event.date + "T00:00:00").toLocaleDateString(
      "en-US",
      { month: "long", day: "numeric", year: "numeric" }
    );

    card.innerHTML = `
      <div class="card-content">
        <img src="../assets/logos/TMU.svg" alt="TMU Logo">

        <div class="details">
          <div class="title-bar">
            <h3>${event.title}</h3>

            <div class="title-icons">
              <img src="../assets/icons/calendar.svg" alt="Calendar Icon">
              <img src="../assets/icons/star.svg" alt="Star Icon">
            </div>
          </div>

          <div class="main-details">
            <p>${event.description || ""}</p>

            <div class="detail-rows">
              <div class="detail-cols">
                <div class="detail-item">
                  <img src="../assets/icons/DateIcon.svg" alt="Date Icon">
                  <p>${formattedDate}</p>
                </div>
                <div class="detail-item">
                  <img src="../assets/icons/TimeIcon.svg" alt="Time Icon">
                  <p>${event.time || ""}</p>
                </div>
                <div class="detail-item">
                  <img src="../assets/icons/LocationIcon.svg" alt="Location Icon">
                  <p>${event.location || ""}</p>
                </div>
              </div>

              <div class="detail-cols">
                <div class="detail-item">
                  <img src="../assets/icons/CreatorIcon.svg" alt="Creator Icon">
                  <p>${event.organization || ""}</p>
                </div>
                <div class="detail-item">
                  <img src="../assets/icons/AvailabilityIcon.svg" alt="Availability Icon">
                  <p>${event.capacity || ""}</p>
                </div>
                <div class="detail-item">
                  <img src="../assets/icons/PriceIcon.svg" alt="Price Icon">
                  <p>${event.cost || ""}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="button-bar">
            <button class="btn-delete" data-id="${event.id}">DELETE</button>
            <button class="btn-primary btn-more-info">More Info</button>
          </div>
        </div>
      </div>
    `;

    // Hook up the delete button so it calls the API
    const deleteBtn = card.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", async () => {
      await deleteEvent(event.id);
    });

    // Add the card to the page
    container.appendChild(card);
  });
}

// Delete event by calling DELETE /api/events/:id then reload list
async function deleteEvent(id) {
  try {
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Delete failed.");
      return;
    }
    loadEvents(); // refresh after delete
  } catch (err) {
    console.error(err);
  }
}

// Load tags from the backend and build filter checkboxes dynamically
async function loadTagFilters() {
  const filterDiv = document.getElementById("filter");
  if (!filterDiv) return;

  // Clear filter area and add heading
  filterDiv.innerHTML += "<h2>Event Category</h2>";

  try {
    const res = await fetch("/api/tags");
    const tags = await res.json();

    // If there are no tags, show a small message
    if (!Array.isArray(tags) || tags.length === 0) {
      filterDiv.innerHTML += "<p>No tags yet.</p>";
      return;
    }

    // Create a checkbox for each tag
    tags.forEach(tag => {
      const row = document.createElement("div");
      row.className = "selector";

      row.innerHTML = `
        <input type="checkbox" value="${tag}">
        <label>${tag}</label>
      `;

      // When checkbox changes, apply filters
      row.querySelector("input").addEventListener("change", applyTagFilters);

      filterDiv.appendChild(row);
    });
  } catch (err) {
    console.error("Could not load tags:", err);
  }
}

// Filter allEvents based on checked tags
function applyTagFilters() {
  // Find all checked tag checkboxes
  const selectedTags = Array.from(
    document.querySelectorAll("#filter input[type='checkbox']:checked")
  ).map(cb => cb.value);

  // If nothing checked, show all
  if (selectedTags.length === 0) {
    displayEvents(allEvents);
    return;
  }

  // Keep events that contain ANY of the selected tags
  const filtered = allEvents.filter(event => {
    if (!Array.isArray(event.tags)) return false;
    return selectedTags.some(tag => event.tags.includes(tag));
  });

  displayEvents(filtered);
}

// Filter events by name/description
function searchFilter() {
  const searchForm = document.getElementById('search-event');

  // Check if form exists
  if (searchForm) {

    // Wait for submit event to search for event
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const searchTerm = e.target.title.value.toLowerCase();

      // Filter events based on keyword entered
      const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.organization.toLowerCase().includes(searchTerm)
      );

      displayEvents(filtered);
    });
  }
}

// Filter by date
function dateFilter() {
  const searchForm = document.getElementById('search-date');

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get values of the dates
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;

    // Filter events based on the 3 options
    const filtered = allEvents.filter(event => {
      const eventDate = event.date;

      // When from and to date given
      if (fromDate && toDate) {
        return eventDate >= fromDate && eventDate <= toDate;
      }
      // When only from date is given
      else if (fromDate) {
        return eventDate >= fromDate;
      }
      // When only to date is given
      else if (toDate) {
        return eventDate <= toDate;
      }
      // When no dates given
      else
        return true;
    });

    // Display the results
    displayEvents(filtered);
  });
}

// Run when page loads
document.addEventListener("DOMContentLoaded", loadEvents);
