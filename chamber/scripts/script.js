const hamburger = document.querySelector('.hamburger');
const viewGridBtn = document.querySelector('.view-grid');
const currentYear = document.querySelector('#currentYear');
const lastModified = document.querySelector('#lastModified');
const navMenu = document.querySelector('.main-nav');

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
})

lastModified.textContent = "Last modified: " + document.lastModified;