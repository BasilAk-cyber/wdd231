const search = document.querySelector("#movie-search");
const modalDiv = document.querySelector('#modal');
const favourite = document.querySelector(".favourite-grid");
const favouriteCount = document.querySelector(".favourite-count");
const searchBtn= document.querySelector(".fa-magnifying-glass");
const backBtn = document.querySelector(".back-btn");



const API_KEY    = 'a2c591ca1a60a0006587bb9ef83af45f';   // ← replace!
const IMG_URL    = "https://image.tmdb.org/t/p/w500";
const BASE_URL   = "https://api.themoviedb.org/3";

let currentMovie = null;
let favorites    = JSON.parse(localStorage.getItem("favMovies")) || [];

function saveFavorites() {
  localStorage.setItem("favMovies", JSON.stringify(favorites));
  //document.getElementById("fav-count").textContent = favorites.length;
}

function isFavorite(id) {
  return favorites.some(m => m.id === id);
}

function getPoster(path) {
  return path ? IMG_URL + path : "https://via.placeholder.com/300x450?text=No+Poster";
}

if (favorites.length === 0) {
  console.log("no favourites yet");
}

favorites.forEach(element => {
  console.log(element);
});

console.log(favorites.length);

if (window.location.pathname.includes("favourite.html")) {
  favouriteCount.textContent = favorites.length;
}


function createCard(movie) {
  const div = document.createElement("div");
  div.className = "movie-card";
  div.innerHTML = `
    <figure>
      <img 
        src="${getPoster(movie.poster_path)}" 
        alt="${movie.title}"
        class="movie-image">
    </figure>
    <div class="movie-name">
      <p>${movie.title}</p>
    </div>
    <div class="movie-genre">
      <p>${movie.release_date.slice(0, 4) || "—"}</p>
    </div>
  `;

  div.onclick = () => openModal(movie.id);
  return div;
}

//const query = search.textContent;

async function loadMovies(query) {
  let url = query
    ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}`;

  try {
    const res  = await fetch(url);
    const data = await res.json();
    console.log(data);
    const grid = document.getElementById("movie-catalog");
    grid.innerHTML = "";

    if (!data.results?.length) {
      grid.innerHTML = "<p style='grid-column:1/-1;text-align:center;color:#777'>No movies found</p>";
      return;
    }

    data.results.forEach(m => {
      grid.appendChild(createCard(m));
    });

  } catch (err) {
    console.error(err);
    alert("Could not load movies. Check API key / internet.");
  }
}

async function openModal(movieId) {
  try {
    const res  = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const data = await res.json();

    currentMovie = data;

    modalDiv.appendChild(createModalElement(data));

    document.getElementById("modal").style.display = "flex";

  } catch (err) {
    console.log(err);
    alert("Cannot load movie details.");
  }
}

function createModalElement(movie){

  const modalContent = document.createElement('div');
  modalContent.className = "modal-content";
  modalContent.innerHTML = `
    <div class="modal-head">
        <div class="modal-close" id="modal-close" onclick="event.stopPropagation(); closeModal()"><i class="fa-solid fa-arrow-left" style="color: rgb(233, 69, 96); font-size: 24px;"></i></div>
        <div class="fav-btn-div" onclick="event.stopPropagation(); favouriteBtnClick()">${updateButtonState(movie.id)}</div>
    </div>
    <div class="modal-body">
        <h2 class="modal-title" id="modal-title">${movie.title}</h2>
        <div class="modal-year" id="modal-year">${movie.release_date?.slice(0,4) || "—"}</div>
        <div class="modal-rating" id="modal-rating"> ★ ${movie.vote_average?.toFixed(1) || "?"}</div>
        <p class="modal-overview" id="modal-overview">${movie.overview || "No description available."}</p>

    </div>
  `
  return modalContent
}

function renderFavourite(){

  favorites.forEach((f) => {
    const favCard = createCard(f);
    favourite.appendChild(favCard);
  })
}


function updateButtonState(id) {
  if (isFavorite(id)) {
    return '<i class="fa-solid fa-heart" style="color: rgb(233, 69, 96); font-size:24px;"></i>'
  } else {
    return '<i class="fa-regular fa-heart" style="color: rgb(233, 69, 96); font-size:24px;"></i>'
  }
}

//Function
//get id and add to favourite
// renders favourite by make an api call line by line

function favouriteBtnClick(){

  const index = favorites.findIndex(m => m.id === currentMovie.id);

  if(index === -1){
    favorites.push(currentMovie);
  }else{
    favorites.splice(index, 1)
  }

  saveFavorites();
  //closeModal();
  document.querySelector(".fav-btn-div").innerHTML = "";
  document.querySelector(".fav-btn-div").innerHTML = updateButtonState(currentMovie.id)

}

function closeModal(){
  modalDiv.innerHTML = "";
  document.getElementById("modal").style.display = "none";
}

if (search){
  search.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          loadMovies(search.value.trim());
      }
  });
}

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    loadMovies(search.value.trim());
  });

  loadMovies();
}


modalDiv.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});


backBtn.addEventListener('click', () => {
  window.location.href = "index.html";
})

if (window.location.pathname.includes("favourite.html")) {
  console.log("on favourites page");
  console.log("favorites array:", favorites);
  console.log("favourite grid:", favourite);
  renderFavourite();
}
//openModal(974576);