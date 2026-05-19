// light / dark Modes
let mode = document.getElementById("darkM");
mode.addEventListener('click', ()=>{
    document.body.classList.toggle("darkM");
})

// ================
// DOM Selectors
// ================
let cities = JSON.parse(localStorage.getItem("weatherHistory")) || [];

let cityInput = document.getElementById('cityInput');
let searchForm = document.getElementById("searchForm");
let selectCity = document.getElementById('selectCity');
let result = document.getElementById('result');
let mainTitle = document.getElementById("mainTitle");
let clearHistoryBtn = document.getElementById('clearHistoryBtn');
let historyList = document.getElementById('historyList');

// API Key
let apiKey = "ec52575a4326f4391ce9f7394481a60e";

// Map API descriptions to local SVG/PNG files in AIassets folder
const iconMapping = {
    "clear sky": "AIassets/sun.svg",
    "few clouds": "AIassets/cloud-sun.svg",
    "scattered clouds": "AIassets/cloud.svg",
    "broken clouds": "AIassets/clouds.svg",
    "shower rain": "AIassets/rain.svg",
    "rain": "AIassets/cloud-rain.svg",
    "thunderstorm": "AIassets/lightning.svg",
    "snow": "AIassets/snow.svg",
    "mist": "AIassets/fog.svg",
    "fog": "AIassets/fog.svg"
};

// Fallback function triggered if the external API image fails to load
function handleIconError(image) {
    image.onerror = null; // Prevents infinite loops if the fallback also fails
    const description = image.alt.toLowerCase();
    
    // Mapping to find a local icon, or use a generic default
    image.src = iconMapping[description] || 'AIassets/default-weather.svg';
    
    console.warn(`Weather icon failed to load. Falling back to local icon for: ${description}`);
}

// getWeather function
async function getWeather(city) {
    if(!city){
        result.textContent = "Enter a City name!"
        return;
    }
    
    result.textContent = "Loading...";

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)

        if(!response.ok){
            throw new Error(`City not found (${response.status})`);
        }

        // Convert response to JavaScript object ✅ Now data exists
        let data = await response.json();
        showWeather(data);
        
        localStorage.setItem("lastCity", data.name)

        // ✅ Destructure AFTER data exists
        const { name, main: { temp } } = data;
        const time = new Date().toLocaleString();

        // ✅ Remove old entry (object-based, no duplicates)
        cities = cities.filter(item => item.city !== name);

        // 🔥 Add newest entry
        cities.push({ city: name, temp, time });

        // ✅ Keep only latest 10
        cities = cities.slice(-10);

        // Save and Update UI
        localStorage.setItem("weatherHistory", JSON.stringify(cities));
        renderHistory();        
    }
    catch(error){
        result.textContent = error.message;
    }
}


// 1. Get the value and store it in a variable
const lastCity = localStorage.getItem("lastCity");
// 2. Check if it exists (not null)
if (lastCity) {
    getWeather(lastCity);
}
// 3. Don't forget to show the history list on startup too!
renderHistory();


// Weather Template Function
function weatherTemplate(data) {
    const {
        name,
        weather,
        main,
        wind,
        sys,
        coord
    } = data;

    const temp = main.temp;
    const fahrenheit = temp * 9/5 + 32;
    const kelvin = temp + 273.15;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunset  = new Date(sys.sunset * 1000).toLocaleTimeString();

    // The external API URL
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    return `
        <div class="weather-container">
            <div class="weather-main">
                <h2>${name}</h2>
                <img 
                    src="${iconUrl}" 
                    alt="${weather[0].description}" 
                    onerror="handleIconError(this)" 
                    style="width: 100px; height: 100px;"
                >
                <p>${weather[0].description}</p>
                <p>
                    🌡️ <b>${temp}</b> °C,
                    ${fahrenheit.toFixed(2)} °F,
                    ${kelvin.toFixed(2)} K
                </p>
                <p>Max: ${main.temp_max}, Min: ${main.temp_min}</p>
            </div>

            <div class="weather-details">
                <br><br><p>💦 Humidity: ${main.humidity}%</p>
                <p>
                    💨 Wind speed:
                    ${wind.speed} m/s
                    (${(wind.speed * 2.237).toFixed(2)} mph)
                </p>
                <p>🌅 Sunrise: ${sunrise}</p>
                <p>🌄 Sunset: ${sunset}</p>
                <p>📍 Lat: ${coord.lat}, Lon: ${coord.lon}</p>
            </div>
        </div>
    `;
}

// showWeather Function
function showWeather(data){
    console.log(data);

    result.innerHTML = weatherTemplate(data);
    
    // cityInput.value = ""; Or I prefere:
    searchForm.reset();

    const temp = data.main.temp;

    mainTitle.classList.remove("cold", "warm", "hot");
    
    if(temp <= 15){
        mainTitle.classList.add("cold");
    }else if(temp >15 && temp <=28){
        mainTitle.classList.add("warm");
    }else if(temp > 28){
        mainTitle.classList.add("hot");
    }else{
        console.error("Temperature data is missing or corrupted");
    }
}


// renderHistory function
function renderHistory() {
    historyList.innerHTML = ""; // Clear old stuff

    // Use the Spread Operator [...] to create a shallow copy before reversing. This way, the original array stays in the correct order for LocalStorage, but the display is reversed:
    [...cities].reverse().forEach((item) => {
        // 1. Create <li>
        const li = document.createElement("li");
        // li.style.cursor = "pointer"; //li.style...For learning, but better is:
        li.classList.add("history-item");
        
        // 2. Add text span
        const text = document.createElement("span");
        text.textContent = `${item.city} — ${item.temp}°C — ${item.time}`;
        text.style.cursor = "pointer";

        // 3. Add event listener for click
        li.addEventListener("click", ()=>{
            getWeather(item.city); // Re-run the search!
        });

        // Delete button ❌
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");

        // Seperator line
        
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // 🔥 IMPORTANT

            cities = cities.filter(c => c.city !== item.city);
            localStorage.setItem("weatherHistory", JSON.stringify(cities));
            renderHistory();
        });

        // 4. Append to historyList
        li.appendChild(text);
        li.appendChild(deleteBtn);
        historyList.appendChild(li);
    });
}

// ===================
// Search Button Event
// ===================
searchForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    const city = cityInput.value.trim();
    getWeather(city);
})

// ===================
// Select Option Event
// ===================
selectCity.addEventListener("change", ()=>{
    const city = selectCity.value;
    getWeather(city);
})

// ===================
// Clear History Event
// ===================
clearHistoryBtn.addEventListener("click", ()=>{
  cities = []  ;
  localStorage.removeItem("weatherHistory");

  renderHistory();
})
