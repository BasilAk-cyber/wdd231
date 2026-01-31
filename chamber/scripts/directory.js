// DOM ELEMENTS
const currentYear = document.querySelector('#currentYear');
const lastModified = document.querySelector('#lastModified');
const navMenu = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-links');
const hamburger = document.querySelector('.hamburger');
const businessCardDiv = document.querySelector('.business-card-section');
const viewGridBtn = document.querySelector('.view-grid');

let members = [];

// FETCH MEMBERS
async function fetchMembers() {
    try {
        if (!businessCardDiv) {
            console.error('businessCardDiv not found!');
            return;
        }

        businessCardDiv.innerHTML = '<p class="loading">Loading members...</p>';
        
        const response = await fetch('data/members.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        members = data.members;
        
        console.log('Loaded members:', members);
        
        displayMembers(members);
        
    } catch (error) {
        console.error('Error fetching members:', error);
        if (businessCardDiv) {
            businessCardDiv.innerHTML = `
                <div class="error-message">
                    <p>Sorry, we couldn't load the member directory.</p>
                    <p>Error: ${error.message}</p>
                </div>
            `;
        }
    }
}

// DISPLAY MEMBERS
function displayMembers(memberList) {
    if (!businessCardDiv) {
        console.error('businessCardDiv not found in displayMembers!');
        return;
    }
    
    businessCardDiv.innerHTML = '';
    
    if (memberList.length === 0) {
        businessCardDiv.innerHTML = '<p>No members found.</p>';
        return;
    }
    
    memberList.forEach(member => {
        const card = createMemberCard(member);
        businessCardDiv.appendChild(card);
    });
    
    console.log(`Displayed ${memberList.length} members`);
}

// CREATE MEMBER CARD
function createMemberCard(member) {
    const card = document.createElement('div');
    card.classList.add('business-card');

    card.innerHTML = `
        <div class="business-name-div">
            <p class="business-name">${member.name}</p>
        </div>
        <div class="business-info">
            <div class="business-image">
                <img src="${member.image}" alt="${member.name} logo" loading="lazy">
            </div>
            <div class="business-info-div">
                <p>Email: <span class="email">${member.email}</span></p>
                <p>Phone: <span class="phone-number">${member.phone}</span></p>
                <p>URL: <span class="url">${member.website}</span></p>
            </div>
        </div>
    `;
    
    return card;
}

// TOGGLE VIEW (Grid/List)
function toggleView() {
    if (!businessCardDiv) return;
    
    businessCardDiv.classList.toggle('list-view');
    
    if (businessCardDiv.classList.contains('list-view')) {
        if (viewGridBtn) viewGridBtn.textContent = 'Display Grid';
    } else {
        if (viewGridBtn) viewGridBtn.textContent = 'Display List';
    }
}

// EVENT LISTENERS

// Hamburger menu
if (hamburger) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

// View toggle button
if (viewGridBtn) {
    viewGridBtn.addEventListener('click', toggleView);
}

// Close menu when clicking nav links
if (navLinks) {
    navLinks.forEach(element => {
        element.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    });
}

// Footer info
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = "Last modified: " + document.lastModified;
}

// INITIALIZE
fetchMembers();