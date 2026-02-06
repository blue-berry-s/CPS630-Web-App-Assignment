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
                    <p>${event.date}</p>
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

  } catch (error) {
    console.error("Failed to load events:", error);
  }
}

// Initialize the load when the page is ready
document.addEventListener('DOMContentLoaded', loadEvents);