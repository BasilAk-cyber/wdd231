
const currentYear = document.querySelector('#currentYear');
const lastModified = document.querySelector('#lastModified');
const navMenu = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.nav-links');
const hamburger = document.querySelectorAll('.hamburger');



hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
})

navLinks.forEach(element => {
    element.addEventListener("click", () => {
        navMenu.classList.remove("active");
    })
});
lastModified.textContent = "Last modified: " + document.lastModified;
