const registrationGrid = document.getElementById("registrationGrid");

window.onload = function(){
    showRegistrationAdditional();
};

// If registration is required - show additional form information that allows input of registration items
function showRegistrationAdditional(){

    // <div class="div4"><h3> Registration Opens</h3></div>
    const div4 = document.createElement("div");
    div4.classList.add("div4");
    div4.innerHTML=`<h3> Registration Opens</h3>`;

    const div5 = document.createElement("div");
    div5.classList.add("selector");
    div5.classList.add("div5");

    /**
     * <div class="selector div5">
            <input type="radio" id="dateToday" name="registrationDate" value="dateToday" checked />
            <label for="dateToday"> Today </label>
          </div>
     */
    div5.innerHTML =`
            <input type="radio" id="dateToday" name="registrationDate" value="dateToday" checked />
            <label for="dateToday"> Today </label>
            `;

    //<div class="selector div6">
    const div6 = document.createElement("div");
    div6.classList.add("selector");
    div6.classList.add("div6");


    /**
     * <input type="radio" id="dateOther" name="registrationDate" value="dateOther" />
            <label for="dateOther">  <input type="date" id="registrationDateDate"> </label>
     */
    div6.innerHTML =`
            <input type="radio" id="dateOther" name="registrationDate" value="dateOther" />
            <label for="dateOther">  <input type="date" id="registrationDateDate"> </label>`;

    // <div class="div7"><h3> Registration Link</h3></div>
    const div7 = document.createElement("div");
    div7.classList.add("div7");
    div7.innerHTML=`<h3> Registration Link</h3>`;


    // <div class="div8"><input type="text" id="registrationLink" name="registrationLink" placeholder="Registration Link"></div>
    const div8 = document.createElement("div");
    div8.classList.add("div8");
    div8.innerHTML=`<input type="text" id="registrationLink" name="registrationLink" placeholder="Registration Link" required>`;

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