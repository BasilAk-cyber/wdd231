
const currentYear = document.querySelector('#currentYear');
const lastModified = document.querySelector('#lastModified');
const navMenu = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-links');
const hamburger = document.querySelector('.hamburger');
const directoryDisplay = document.querySelector('.business-card-section');
const viewGridBtn = document.querySelector('.view-grid');
const weatherSymbol = document.querySelector(".weather-logo");
const temparature = document.querySelector(".temp");
const Date = document.querySelector(".date");
const Highs = document.querySelector(".highs");
const description = document.querySelector(".weather-desc")
const lows = document.querySelector(".lows");
const humidity = document.querySelector(".humidity");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");

const API_KEY = window.CONFIG?.API_KEY || '8480cb04b62842d8b41f0af968d69401';


async function getWeatherInfo() {
    try {
        // You need to provide actual latitude and longitude values
        /* const lat = 'YOUR_LATITUDE';
        const lon = 'c-94.04'; */
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=33.44&lon=-94.04&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);

        // Update based on OpenWeather API structure
        temparature.textContent = `${Math.round(data.main.temp)}°C`;
        humidity.textContent = `${data.main.humidity}%`;
        description.textContent = data.weather[0].description ;
        
        // For highs and lows (from daily forecast)
        highs.textContent = `${Math.round(data.main.temp_max)}°C`;
        lows.textContent = `${Math.round(data.main.temp_min)}°C`;


        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);
        
        sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        sunset.textContent = sunsetTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        dateElement.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const iconCode = data.current.weather[0].icon;
        weatherSymbol.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

getWeatherInfo();


hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
})

viewGridBtn.addEventListener("click", () => {
    directoryDisplay.classList.toggle("active");
    viewGridBtn.textContent = 'Display Grid';
})

navLinks.forEach(element => {
    element.addEventListener("click", () => {
        navMenu.classList.remove("active");
    })
});
lastModified.textContent = "Last modified: " + document.lastModified;
