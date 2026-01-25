
const currentYear = document.querySelector('#currentYear');
const lastModified = document.querySelector('#lastModified');
const navMenu = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-links');
const hamburger = document.querySelector('.hamburger');
const directoryDisplay = document.querySelector('.business-card-section');
const viewGridBtn = document.querySelector('.view-grid');



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
