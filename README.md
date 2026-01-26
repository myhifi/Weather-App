# 🌦️ My Level05 Weather App

A responsive and interactive web application that provides real-time weather data for cities worldwide. This project features a dynamic UI that adapts to temperature changes and supports a persistent search history.

## ✨ Features

* **Real-time Weather Data:** Fetches live updates (temperature, humidity, wind speed, etc.) using the OpenWeatherMap API.
* **Dynamic Theming:** - **Temperature-Based Colors:** The main title automatically changes color based on the city's temperature: **Blue** for cold (≤15°C), **Green** for warm (16-28°C), and **Red** for hot (>28°C).
* **Dark/Light Mode:** A toggle button to switch between light and dark themes with smooth transitions.


* **Persistent Search History:** - Automatically saves the last 10 searched cities to `localStorage`.
* Users can click on any history item to re-run the search instantly.
* Individual items can be deleted, or the entire history can be cleared.


* **Smart Search Options:** - Search via a standard input field.
* Quick-select menu featuring major Egyptian and Global cities.


* **Comprehensive Details:** Displays sunrise/sunset times, coordinates, and temperature conversions (Celsius, Fahrenheit, and Kelvin).

## 🛠️ Tech Stack

* **HTML5:** Semantic structure.
* **CSS3:** Custom properties (CSS Variables) for theming and Flexbox for responsive layouts.
* **JavaScript (ES6+):** Asynchronous programming (Async/Await), Fetch API, and LocalStorage for data persistence.
* **OpenWeatherMap API:** External data source for global weather information.

## 📁 Project Structure

```text
├── index.html           # Main entry point (the renamed MyLevel05.html)
└── AIassets/
    └── myLevel05.js     # Core logic, API handling, and UI updates

```

## 🚀 Getting Started

1. **Clone or Download:** Save the project files to your local machine.
2. **Open the App:** Simply double-click `index.html` to launch it in your preferred web browser.
3. **Usage:**
* Type a city name in the input field and press **Search**.
* Alternatively, choose a city from the **Select a City** dropdown menu.
* Use the **Light/Dark Mode** button at the top left to change the theme.



## 📝 Note

This application uses a specific API key for OpenWeatherMap. If you plan to deploy this for high-traffic use, it is recommended to generate your own free API key from [OpenWeatherMap.org](https://openweathermap.org/).

---

*Developed as part of the Web Development Journey*
