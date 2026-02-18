const search = document.querySelector("#movie-search");
const modalDiv = document.querySelector('#modal');
console.log(modalDiv)

const API_KEY    = 'a2c591ca1a60a0006587bb9ef83af45f';   // ← replace!
const IMG_URL    = "https://image.tmdb.org/t/p/w500";
const BASE_URL   = "https://api.themoviedb.org/3";

let currentMovie = null;
let favorites    = JSON.parse(localStorage.getItem("favMovies")) || [];

function saveFavorites() {
  localStorage.setItem("favMovies", JSON.stringify(favorites));
  document.getElementById("fav-count").textContent = favorites.length;
}

function isFavorite(id) {
  return favorites.some(m => m.id === id);
}

function getPoster(path) {
  return path ? IMG_URL + path : "https://via.placeholder.com/300x450?text=No+Poster";
}

favorites.forEach(element => {
  console.log(element);
});

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
      <p>Kids & Entertainment</p>
    </div>
  `;

  div.onclick = () => openModal(movie.id);
  return div;
}

const query = search.textContent;

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

    //currentMovie = data;

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
        <div class="fav-btn-div" onclick="event.stopPropagation(); favouriteBtnClick(${movie})">${updateButtonState(movie.id)}</div>
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

  const favourite = document.querySelector(".favourite-grid");

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
function favouriteBtnClick(movie){

  const index = favorites.findIndex(m => { m.id === movie.id});

  if(index === -1){
    favorites.push(movie);
  }else{
    favorites.splice(index, 1)
  }

  saveFavorites();
  closeModal();
  createModalElement(movie)

}

function closeModal(){
  modalDiv.innerHTML = "";
  document.getElementById("modal").style.display = "none";
}

search.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = input.value.trim();
        searchMovies(query);
    }
});

modalDiv.addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});
loadMovies("Conclave");
console.log(updateButtonState())
//openModal(974576);