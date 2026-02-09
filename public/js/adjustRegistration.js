const registrationGrid = document.getElementById("registrationGrid");

window.onload = function(){
    showRegistrationAdditional();
};

function showRegistrationAdditional(){

    // <div class="div4"><h3> Registration Opens</h3></div>
    const div4 = document.createElement("div");
    div4.classList.add("div4");
    const registrationOpen = document.createElement("h3");
    registrationOpen.textContent = "Registration Opens";
    div4.appendChild(registrationOpen);

    // <div class="div4"><h3> Registration Opens</h3></div>
    const div5 = document.createElement("div");
    div5.classList.add("selector");
    div5.classList.add("div5");

    /**
     * <div class="selector div5">
            <input type="radio" id="dateToday" name="registrationDate" value="dateToday" checked />
            <label for="dateToday"> Today </label>
          </div>
     */
    const registerToday = document.createElement("input");
    registerToday.type = "radio";
    registerToday.id = "dateToday";
    registerToday.name = "registrationDate";
    registerToday.value= "dateToday";
    registerToday.checked = true;

    const registerTodayLabel = document.createElement("label");
    registerTodayLabel.htmlFor = 'dateToday';
    registerTodayLabel.textContent = 'Today';

    div5.appendChild(registerToday);
    div5.appendChild(registerTodayLabel);

    //<div class="selector div6">
    const div6 = document.createElement("div");
    div6.classList.add("selector");
    div6.classList.add("div6");


    /**
     * <input type="radio" id="dateOther" name="registrationDate" value="dateOther" />
            <label for="dateOther">  <input type="date" id="registrationDateDate"> </label>
     */
    const registerLater = document.createElement("input");
    registerLater.type = "radio";
    registerLater.id = "dateOther";
    registerLater.name = "registrationDate";
    registerLater.value= "dateOther";

    const registerLaterLabel = document.createElement("label");
    registerTodayLabel.htmlFor = 'dateOther';

    const registerLabelCalendar = document.createElement("input");
    registerLabelCalendar.type = "date";
    registerLabelCalendar.id = "registrationDateDate";

    registerLaterLabel.appendChild(registerLabelCalendar);
    div6.appendChild(registerLater);
    div6.appendChild(registerLaterLabel);

    // <div class="div7"><h3> Registration Link</h3></div>
    const div7 = document.createElement("div");
    div7.classList.add("div7");
    const registrationLink = document.createElement("h3");
    registrationLink.textContent = "Registration Link";
    div7.appendChild(registrationLink);


    // <div class="div8"><input type="text" id="registrationLink" name="registrationLink" placeholder="Registration Link"></div>
    const div8 = document.createElement("div");
    div8.classList.add("div8");
    const registrationLinkInput = document.createElement("input");
    registrationLinkInput.type = "text";
    registrationLinkInput.name = "registrationLink"
    registrationLinkInput.id = "registrationLink";
    registrationLinkInput.placeholder = "Registration Link";
    div8.appendChild(registrationLinkInput);

    registrationGrid.appendChild(div4);
    registrationGrid.appendChild(div5);
    registrationGrid.appendChild(div6);
    registrationGrid.appendChild(div7);
    registrationGrid.appendChild(div8);
    
}

// hides additional registraion input
function hideRegistrationAdditional(){
    registrationGrid.removeChild(document.getElementsByClassName("div4")[0]);
    registrationGrid.removeChild(document.getElementsByClassName("div5")[0]);
    registrationGrid.removeChild(document.getElementsByClassName("div6")[0]);
    registrationGrid.removeChild(document.getElementsByClassName("div7")[0]);
    registrationGrid.removeChild(document.getElementsByClassName("div8")[0]);
    
}