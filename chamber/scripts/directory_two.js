const directoryDisplay = document.querySelector('.business-card-section');
const viewGridBtn = document.querySelector('.view-grid');

let members = [];

async function fetchMembers() {
  try {
    directoryDisplay.innerHTML = '<p class="loading">Loading members...</p>';
    
    const response = await fetch('data/members.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    members = data.members;
    
    displayMembers(members);
    
  } catch (error) {
    console.error('Error fetching members:', error);
    directoryDisplay.innerHTML = `
      <div class="error-message">
        <p>Sorry, we couldn't load the member directory.</p>
        <p>Error: ${error.message}</p>
      </div>
    `;
  }
}

function displayMembers(memberList) {
  if (!directoryDisplay) return;
  
  directoryDisplay.innerHTML = '';
  
  memberList.forEach(member => {
    const card = createMemberCard(member);
    directoryDisplay.appendChild(card);
  });
}

function createMemberCard(member) {
  const card = document.createElement('div');
  card.classList.add('business-card');
  
  const businessNameDiv = document.createElement('div');
  businessNameDiv.classList.add('business-name-div');
  
  const businessInfoDiv = document.createElement('div');
  businessInfoDiv.classList.add('business-info-div');
  
  card.appendChild(businessNameDiv);
  card.appendChild(businessInfoDiv);
  
  businessNameDiv.innerHTML = `
    <p class="business-name">${member.name}</p>
  `;
  
 businessInfoDiv.innerHTML = `

    <div class="business-image">
      <img 
        src="#" 
        alt="${member.name}" 
        loading="lazy"

      >
    </div>
    <div class="business-info">
      <p class="email">
        ${member.industry}
      </p>
      <p class="phone-number">
        ${member.phone}
      </p>
      <p class="url">
        ${member.website}
      </p>
    </div>
  `
  
  return card;
}


function toggleView() {
  if (!directoryDisplay) return;
  
  if (directoryDisplay.classList.contains('grid-display')) {
    // Switch to list view
    directoryDisplay.classList.remove('grid-display');
    directoryDisplay.classList.add('list-display');
    if (viewGridBtn) {
      viewGridBtn.innerHTML = '<div>Display Grid</div>';
    }
    localStorage.setItem('directoryView', 'list');
  } else {
    // Switch to grid view
    directoryDisplay.classList.remove('list-display');
    directoryDisplay.classList.add('grid-display');
    if (viewGridBtn) {
      viewGridBtn.innerHTML = '<div>Display List</div>';
    }
    localStorage.setItem('directoryView', 'grid');
  }
}

// LOAD VIEW PREFERENCE - FIXED
function loadViewPreference() {
  const savedView = localStorage.getItem('directoryView');
  
  if (savedView === 'list' && directoryDisplay) {
    directoryDisplay.classList.remove('grid-display');
    directoryDisplay.classList.add('list-display');
    if (viewGridBtn) {
      viewGridBtn.innerHTML = '<div>Display Grid</div>';
    }
  } else if (directoryDisplay) {
    // Default to grid view
    directoryDisplay.classList.add('grid-display');
    if (viewGridBtn) {
      viewGridBtn.innerHTML = '<div>Display List</div>';
    }
  }
}

// EVENT LISTENER
if (viewGridBtn) {
  viewGridBtn.addEventListener('click', toggleView);
}

// INITIALIZE
async function initDirectory() {
  loadViewPreference();
  await fetchMembers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDirectory);
} else {
  initDirectory();
}