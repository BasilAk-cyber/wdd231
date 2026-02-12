import places from "../data/attraction.mjs";

console.log(places);


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
const attractionSection = document.querySelector(".discovery-section");

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

if (temparature && humidity && description) {
    getWeatherInfo();
}

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

if (highlight) {
    fetchHighlight();
}
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

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

if (viewGridBtn && directoryDisplay){
  viewGridBtn.addEventListener("click", () => {
    directoryDisplay.classList.toggle("active");
    viewGridBtn.textContent = 'Display Grid';
  })
}

if(navLinks){
  navLinks.forEach(element => {
    element.addEventListener("click", () => {
        navMenu.classList.remove("active");
    })
  });
}

// Simple version – or use IntersectionObserver
window.addEventListener('load', () => {
  document.querySelectorAll('.card').forEach((card) => {

    console.log(card);
    setTimeout(() => {
      card.classList.add('visible');
    }, 150);
  });
});

function createCard(attraction) {
    const card = document.createElement('div');
    card.className = 'attraction-figure';
    
    // Create h2 for title
    const title = document.createElement('h2');
    title.className = 'figure-head';
    title.textContent = attraction.name;
    
    // Create figure for image
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = attraction.image;
    img.alt = attraction.title;
    img.loading = 'lazy';
    img.className = "attraction-image";
    figure.appendChild(img);
    
    // Create address tag
    const address = document.createElement('address');
    address.className = "place-address";
    address.textContent = attraction.address;
    
    // Create paragraph for description
    const description = document.createElement('p');
    description.className = "place-description";
    description.textContent = attraction.description;
    
    // Create button
    const button = document.createElement('button');
    button.textContent = 'Learn More';
    button.addEventListener('click', () => {
        alert(`You want to learn more about ${attraction.title}!\n\nAddress: ${attraction.address}\n\nThis feature would typically link to a detailed page or open a modal with more information.`);
    });
    
    // Append all elements to card
    card.appendChild(title);
    card.appendChild(figure);
    card.appendChild(address);
    card.appendChild(description);
    card.appendChild(button);
    
    return card;
}

function displayPlaces(places) {
  if (!attractionSection) return;
  
  attractionSection.innerHTML = '';
  
  places.forEach(places => {
    const card = createCard(places);
    attractionSection.appendChild(card);
  });
}

if (attractionSection) {
    displayPlaces(places);
}
if (lastModified) {
    lastModified.textContent = "Last modified: " + document.lastModified;
}

const KEY_LAST_VISIT = 'lastVisitTimestamp';

function getDaysBetween(date1, date2) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = Math.abs(date2 - date1);
  return Math.floor(diffMs / msPerDay);
}

function showVisitMessage() {
  const now = new Date();
  const msgEl = document.querySelector('.display-message');

  const lastVisitStr = localStorage.getItem(KEY_LAST_VISIT);
  let message = '';
  let className = '';

  if (!lastVisitStr) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const lastVisit = new Date(lastVisitStr);
    const daysAgo = getDaysBetween(lastVisit, now);

    if (daysAgo < 1) {
      message = "Back so soon! Awesome!";
    } else if (daysAgo === 1) {
      message = "You last visited 1 day ago.";
    } else {
      message = `You last visited ${daysAgo} days ago.`;
    }
  }

  msgEl.textContent = message;

  localStorage.setItem(KEY_LAST_VISIT, now.toISOString());
}

showVisitMessage();

