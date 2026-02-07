
const currentYear = document.querySelector('#currentYear');
const lastModified = document.querySelector('#lastModified');
const navMenu = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-links');
const hamburger = document.querySelector('.hamburger');
const directoryDisplay = document.querySelector('.business-card-section');
const viewGridBtn = document.querySelector('.view-grid');
const weatherSymbol = document.querySelector(".weather-logo-image");
const temparature = document.querySelector(".temp");
const date = document.querySelector(".date");
const Highs = document.querySelector(".highs");
const description = document.querySelector(".weather-desc")
const lows = document.querySelector(".lows");
const humidity = document.querySelector(".humidity");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");
const highlight = document.querySelector(".highlight");

const API_KEY = window.CONFIG?.API_KEY || '8480cb04b62842d8b41f0af968d69401';

async function getWeatherInfo() {
    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=33.44&lon=-94.04&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Update based on OpenWeather API structure
        temparature.textContent = `${Math.round(data.main.temp)}°C`;
        humidity.textContent = `${data.main.humidity}%`;
        description.textContent = data.weather[0].description ;
        
        // For highs and lows (from daily forecast)
        Highs.textContent = `${Math.round(data.main.temp_max)}°C`;
        lows.textContent = `${Math.round(data.main.temp_min)}°C`;


        const sunriseTime = new Date(data.sys.sunrise * 1000);
        const sunsetTime = new Date(data.sys.sunset * 1000);

        const sunriseFormatted = sunriseTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true
        });
        
        const sunsetFormatted = sunsetTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true
        });
        
        sunrise.textContent = sunriseFormatted;
        sunset.textContent = sunsetFormatted;

        dateElement.textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const iconCode = data.weather[0].icon;
        weatherSymbol.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

getWeatherInfo();

async function fetchHighlight() {
  try {
    highlight.innerHTML = '<p class="loading">Loading members...</p>';
    
    const response = await fetch('data/members.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    members = data.members;

    const highlightMembers = members.filter((m) => m.membershipLevel === 3);
    
    displayHighlightMembers(highlightMembers);
    
  } catch (error) {
    console.error('Error fetching members:', error);
    highlight.innerHTML = `
      <div class="error-message">
        <p>Sorry, we couldn't load the member directory.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

fetchHighlight();

function displayHighlightMembers(memberList) {
  if (!highlight) return;
  
  highlight.innerHTML = '';
  
  memberList.forEach(member => {
    const card = createHighlightMemberCard(member);
    highlight.appendChild(card);
  });
}

function createHighlightMemberCard(member) {

  const card = document.createElement('div');
  card.classList.add('business-card');

  card.innerHTML = `
      <div class="business-name-div">
          <p class="business-name">${member.name}</p>
      </div>
      <div class="business-info">
          <div class="business-image">
              <img src="${member.image}" alt="">
          </div>
          <div class="business-info-div">
              <p>Email: <span class="email">${member.email}</span></p>
              <p>Phone: <span class="phone-number">${member.phone}</span></p>
              <p>URL: <span class="url">${member.website}</span></p>
          </div>
      </div>
`
  return card;
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

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

// Simple version – or use IntersectionObserver
window.addEventListener('load', () => {
  document.querySelectorAll('.card').forEach((card) => {

    console.log(card);
    setTimeout(() => {
      card.classList.add('visible');
    }, 150);
  });
});
lastModified.textContent = "Last modified: " + document.lastModified;


