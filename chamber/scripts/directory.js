const businessCardDiv = document.querySelector('.business-card-section');
const viewGridBtn = document.querySelector('.view-grid');


let members = [];

async function fetchMembers() {
  try {
    businessCardDiv.innerHTML = '<p class="loading">Loading members...</p>';
    
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
  if (!businessCardDiv) return;
  
  businessCardDiv.innerHTML = '';
  
  memberList.forEach(member => {
    const card = createMemberCard(member);
    businessCardDiv.appendChild(card);
  });
}

function createMemberCard(member) {

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


function toggleView() {
  if (!businessCardDiv) return;
  
  if (businessCardDiv.classList.contains('business-card-section')) {
    businessCardDiv.classList.remove('business-card-section');
    businessCardDiv.classList.add('business-card-section-list');
    if (viewGridBtn) viewGridBtn.textContent = 'Display Grid';
    //localStorage.setItem('directoryView', 'list');
  } else {
    businessCardDiv.classList.remove('business-card-section-list');
    businessCardDiv.classList.add('business-card-section');
    if (viewGridBtn) viewGridBtn.textContent = 'Display List';
    //localStorage.setItem('directoryView', 'grid');
  }
}

// LOAD VIEW PREFERENCE
/* function loadViewPreference() {
  const savedView = localStorage.getItem('directoryView');
  
  if (savedView === 'list' && directoryDisplay) {
    directoryDisplay.classList.remove('grid-display');
    directoryDisplay.classList.add('list-display');
    if (viewGridBtn) viewGridBtn.textContent = 'Display Grid';
  } else if (directoryDisplay) {
    directoryDisplay.classList.add('grid-display');
    if (viewGridBtn) viewGridBtn.textContent = 'Display List';
  }
} */

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
