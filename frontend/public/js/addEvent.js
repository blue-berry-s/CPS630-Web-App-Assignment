
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-event-form") || document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // stop page refresh

        // Read the fields from  HTML (using the name attributes)
        const title = document.querySelector('input[name="eventName"]').value.trim();
        const date = document.querySelector('input[name="eventDate"]').value;

        // required check
        if (!title || !date) {
            alert("Please fill in Event Name and Date.");
            return;
        }

        const description = document.querySelector('textarea[name="eventDesc"]').value.trim();
        const location = document.querySelector('input[name="locationData"]').value.trim();
        const time = document.querySelector('input[name="timeData"]').value.trim();
        const organization = document.querySelector('input[name="creatorData"]').value.trim();

        // Convert seats and price into the SAME string format JSON uses
        const seatsNum = document.querySelector('input[name="availabilityData"]').value.trim();
        const priceNum = document.querySelector('input[name="priceData"]').value.trim();

        const capacity = seatsNum ? `${seatsNum} seats` : "";
        const cost = priceNum ? (priceNum === "0" ? "Free" : `$${priceNum}`) : "";

        // Collect all checked tag checkboxes
        const tags = Array.from(
            document.querySelectorAll('input[name="eventTags"]:checked')
        ).map(cb => cb.value);


        // Build payload to match event JSON format
        const payload = {
            title,
            description,
            date,
            time,
            location,
            organization,
            capacity,
            cost,
            tags
        };

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to add event.");
                return;
            }


            setNotice("success", "Success!", "Event Successfully Created!");
            window.scrollTo(0, 0);
            //window.location.href = "/"; // go back to home
        } catch (err) {
            console.error(err);
            alert("Network error. Could not save event.");
        }
    });
});

const notice = document.getElementById("notice");
const noticeType = document.getElementById("noticeType");
const noticeInfo = document.getElementById("noticeInfo");

function setNotice(className, type, info) {
    notice.className = "";
    notice.className = className;
    notice.style.display = "flex";
    noticeType.innerText = type;
    noticeInfo.innerText = info;
}
