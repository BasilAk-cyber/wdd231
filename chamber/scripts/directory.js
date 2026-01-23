const directoryDisplay = document.querySelector('.business-card-section');
const businessCard = document.querySelector('.business-card');
const businessName = document.querySelector('.business-name');
const email= document.querySelector('.email');
const phoneNumber = document.querySelector('.phone-number');
const url= document.querySelector('.url');
const viewGridBtn = document.querySelector('.view-grid');
let members = [];

// FETCH MEMBERS FROM JSON
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

// DISPLAY MEMBERS
function displayMembers(memberList) {
  if (!directoryDisplay) return;
  
  directoryDisplay.innerHTML = '';
  
  memberList.forEach(member => {
    const card = createMemberCard(member);
    directoryDisplay.appendChild(card);
  });
}

// CREATE MEMBER CARD
function createMemberCard(member) {
  const card = document.createElement('div');
  card.classList.add('business-card');
  
  const membershipInfo = getMembershipInfo(member.membershipLevel);
  
  card.innerHTML = `
    <img 
      src="${member.image}" 
      alt="${member.name}" 
      loading="lazy"
      onerror="this.src='images/placeholder.jpg'"
    >
    <div class="business-info">
      <h3>${member.name}</h3>
      <p><strong>Address:</strong> ${member.address}</p>
      <p><strong>Phone:</strong> <a href="tel:${member.phone.replace(/\s/g, '')}">${member.phone}</a></p>
      <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${getDisplayUrl(member.website)}</a></p>
      ${member.industry ? `<p><strong>Industry:</strong> ${member.industry}</p>` : ''}
      ${member.yearEstablished ? `<p><strong>Established:</strong> ${member.yearEstablished}</p>` : ''}
      ${member.description ? `<p class="description">${member.description}</p>` : ''}
      <span class="membership-badge ${membershipInfo.className}">${membershipInfo.text}</span>
    </div>
  `;
  
  return card;
}

// GET MEMBERSHIP INFO
function getMembershipInfo(level) {
  switch(Number(level)) {
    case 3:
      return { text: '🏆 Gold Member', className: 'membership-gold' };
    case 2:
      return { text: '🥈 Silver Member', className: 'membership-silver' };
    case 1:
    default:
      return { text: '🥉 Member', className: 'membership-member' };
  }
}

// GET DISPLAY URL
function getDisplayUrl(url) {
  return url.replace(/^https?:\/\/(www\.)?/, '');
}

// TOGGLE VIEW
function toggleView() {
  if (!directoryDisplay) return;
  
  if (directoryDisplay.classList.contains('grid-display')) {
    directoryDisplay.classList.remove('grid-display');
    directoryDisplay.classList.add('list-display');
    if (viewGridBtn) viewGridBtn.textContent = 'Display Grid';
    localStorage.setItem('directoryView', 'list');
  } else {
    directoryDisplay.classList.remove('list-display');
    directoryDisplay.classList.add('grid-display');
    if (viewGridBtn) viewGridBtn.textContent = 'Display List';
    localStorage.setItem('directoryView', 'grid');
  }
}

// LOAD VIEW PREFERENCE
function loadViewPreference() {
  const savedView = localStorage.getItem('directoryView');
  
  if (savedView === 'list' && directoryDisplay) {
    directoryDisplay.classList.remove('grid-display');
    directoryDisplay.classList.add('list-display');
    if (viewGridBtn) viewGridBtn.textContent = 'Display Grid';
  } else if (directoryDisplay) {
    directoryDisplay.classList.add('grid-display');
    if (viewGridBtn) viewGridBtn.textContent = 'Display List';
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
