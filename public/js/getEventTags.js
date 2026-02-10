document.addEventListener("DOMContentLoaded", () => {
    DisplayTags();
});




//document.addEventListener("DOMContentLoaded", getAllTags);

async function DisplayTags(){
    try{
        const res = await fetch("/api/tags");
        const allTags = await res.json();
        const tagsContainer = document.getElementById("tagsContainer");

        // If there are no tags, show a small message
        if (!Array.isArray(allTags) || allTags.length === 0) {
            const message = document.createElement("p");
            message.textContent= "No Tags Found on Server";
            tagsContainer.appendChild(message)

            return;
        }

        
        // Add tags to the correct HTML section
        allTags.forEach(tag => {
            const selectorDiv = document.createElement("div");
            selectorDiv.classList.add("selector");
            selectorDiv.innerHTML = `
                <input type="checkbox" name="${tag.toLowerCase()}Tag" id="${tag.toLowerCase()}Tag" />
                <label for="academicsTag">${tag}</label>
            `;
            
            tagsContainer.appendChild(selectorDiv);
        });
    }
    catch (err){
        console.error("Could not load tags:", err);
        setNotice("alert", "WARNING!", "Could Not Get Tags From Server");
    }

}

function setNotice(className, type, info){
        const noticeEle = document.getElementById("notice");
        const noticeType = document.getElementById("noticeType");
        const noticeInfo = document.getElementById("noticeInfo");

        noticeEle.className = "";
        noticeEle.className = className;
        noticeEle.style.display = "flex";
        noticeType.innerText = type;
        noticeInfo.innerText = info;
}