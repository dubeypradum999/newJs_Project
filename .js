const API_KEY = "YOUR_API_KEY";
const API_URL = "https://api.nasa.gov/planetary/apod";

// Get today's date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split("T")[0];


// --------------------------------------------------
// GET CURRENT IMAGE OF THE DAY
// --------------------------------------------------
async function getCurrentImageOfTheDay() {

    const container = document.getElementById("current-image-container");

    try {

        container.innerHTML = "<p>Loading...</p>";

        const response = await fetch(
            `${API_URL}?date=${currentDate}&api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch NASA data.");
        }

        const data = await response.json();

        displayImage(data);

    } catch (error) {

        container.innerHTML = `
            <p class="error">
                Error: ${error.message}
            </p>
        `;
    }
}


// --------------------------------------------------
// GET IMAGE OF SELECTED DATE
// --------------------------------------------------
async function getImageOfTheDay(date) {

    const container = document.getElementById("current-image-container");

    try {

        container.innerHTML = "<p>Loading...</p>";

        const response = await fetch(
            `${API_URL}?date=${date}&api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch NASA image for this date.");
        }

        const data = await response.json();

        // Display result
        displayImage(data);

        // Save date
        saveSearch(date);

        // Update history
        addSearchToHistory();

    } catch (error) {

        container.innerHTML = `
            <p class="error">
                Error: ${error.message}
            </p>
        `;
    }
}


// --------------------------------------------------
// DISPLAY NASA IMAGE
// --------------------------------------------------
function displayImage(data) {

    const container = document.getElementById("current-image-container");

    let mediaHTML = "";

    if (data.media_type === "image") {

        mediaHTML = `
            <img src="${data.url}" 
                 alt="${data.title}">
        `;

    } else if (data.media_type === "video") {

        mediaHTML = `
            <iframe
                src="${data.url}"
                width="100%"
                height="500"
                frameborder="0"
                allowfullscreen>
            </iframe>
        `;
    }

    container.innerHTML = `
        <h2>${data.date}</h2>

        <h3>${data.title}</h3>

        ${mediaHTML}

        <p>
            ${data.explanation}
        </p>
    `;
}


// --------------------------------------------------
// SAVE SEARCH
// --------------------------------------------------
function saveSearch(date) {

    let searches = JSON.parse(
        localStorage.getItem("searches")
    ) || [];

    // Avoid duplicate dates
    if (!searches.includes(date)) {
        searches.push(date);
    }

    localStorage.setItem(
        "searches",
        JSON.stringify(searches)
    );
}


// --------------------------------------------------
// ADD SEARCH HISTORY
// --------------------------------------------------
function addSearchToHistory() {

    const historyList = document.getElementById("search-history");

    let searches = JSON.parse(
        localStorage.getItem("searches")
    ) || [];

    historyList.innerHTML = "";

    searches.forEach(function(date) {

        const listItem = document.createElement("li");

        listItem.textContent = date;

        listItem.addEventListener("click", function() {

            getImageOfTheDayFromHistory(date);

        });

        historyList.appendChild(listItem);
    });
}


// --------------------------------------------------
// FETCH IMAGE FROM SEARCH HISTORY
// --------------------------------------------------
async function getImageOfTheDayFromHistory(date) {

    const container = document.getElementById("current-image-container");

    try {

        container.innerHTML = "<p>Loading...</p>";

        const response = await fetch(
            `${API_URL}?date=${date}&api_key=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch NASA data.");
        }

        const data = await response.json();

        displayImage(data);

    } catch (error) {

        container.innerHTML = `
            <p class="error">
                Error: ${error.message}
            </p>
        `;
    }
}


// --------------------------------------------------
// FORM SUBMIT
// --------------------------------------------------
document.getElementById("search-form").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const selectedDate =
            document.getElementById("search-input").value;

        if (selectedDate) {
            getImageOfTheDay(selectedDate);
        }
    }
);


// --------------------------------------------------
// PAGE LOAD
// --------------------------------------------------
window.addEventListener("DOMContentLoaded", function() {

    // Show today's NASA picture
    getCurrentImageOfTheDay();

    // Show previous searches
    addSearchToHistory();
});
