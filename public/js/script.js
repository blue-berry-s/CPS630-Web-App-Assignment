async function loadEvents() {
  try {
    // Fetch data using API route from server file
    const response = await fetch("/api/events");
    const events = await response.json();

    // Get access to event-cards div
    const container = document.getElementById("event-cards");
    container.innerHTML = "";

    // Loop through each event in json file
    events.forEach(event => {
      const card = document.createElement("div");
      card.className = "event-card-container";

      // Mapping event details to respective elements
      card.innerHTML = `
        <div class="card-content">
          <img src="../assets/logos/TMU.jpg" alt="TMU Logo">

          <div class="details">
            <div class="title-bar">
              <h3>${event.title}</h3>

              <div class="title-icons">
                <img src="../assets/icons/calendar.svg" alt="Not Added Calender Icon">
                <img src="../assets/icons/star.svg" alt="Not Favourited Icon">
              </div>
            </div>

            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p class="tickets">Only ${event.remaining || 'few'} tickets left!</p>
            <button class="btn-delete"> DELETE </button>
            <button class="btn-primary btn-more-info">More Info</button>
          </div>
        </div>
      `;

      // Add to other cards
      container.appendChild(card);
    });

  } catch (error) {
    console.error("Failed to load events:", error);
  }
}

// Initialize the load when the page is ready
document.addEventListener('DOMContentLoaded', loadEvents);