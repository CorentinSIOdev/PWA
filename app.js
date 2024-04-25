const movieListJSON = document.getElementById("movie-list-json");
const movieList = document.getElementById("movie-list-api");
const movieListPersonalAPI = document.getElementById("movie-list-api-perso");
const notificationContainer = document.getElementById("notification-container");
const notificationIcon = document.getElementById("notification-icon");
const notificationCounter = document.getElementById("notification-counter");
const notificationList = document.getElementById("notification-list");
const addMovieForm = document.getElementById("add-movie-form");

let unreadNotifications = 0;

// Fetch movies from the JSON file
function fetchMoviesJSON() {
    fetch("movies.json")
    .then((response) => response.json())
    .then((movies) => {
      movies.forEach((movie) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${movie.title}</strong> (${movie.year}) - ${movie.director} - <img src="${movie.poster}" alt="${movie.title} poster">`;
        movieListJSON.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}

fetchMoviesJSON();

// Fetch movies from the OMDB API
function fetchMoviesOMDB() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTkzN2U1MTBiYWQxZjk3ZDFhZWZiOTlmNDdkMTc0OCIsInN1YiI6IjY2MjYyZjFjNjJmMzM1MDE0YmQ3ZjZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xutUM_YudU8T0QjI012qzPiKdwZCnfSmwH9sVgzVevY'
    }
  };

    fetch('https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1', options)
   .then((response) => response.json())
   .then(movie =>{
      console.log(movie);
      movie.results.forEach((movie) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${movie.title}</strong> <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">`;
        movieList.appendChild(li);
      });
    })
   .catch((error) => {
        console.error("Error fetching movies:", error);
    });
}

fetchMoviesOMDB();

// Fetch movies from the Personal API
function fetchMoviesAPI() {
    fetch("http://localhost:3000/api/movies")
    .then((response) => response.json())
    .then((movies) => {
      movies.forEach((movie) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${movie.title}</strong> <img src="${movie.imageUrl}" alt="${movie.title} poster">`;
        movieListPersonalAPI.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
    });
}

fetchMoviesAPI();

// Post a new movie to the Personal API
addMovieForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(addMovieForm);
  const title = formData.get("title");
  const imageUrl = formData.get("imageUrl");

  fetch("http://localhost:3000/api/create_movie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, imageUrl })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout du film");
    }
    return response.json();
  })
  .then(data => {
    addMovieForm.reset();
  })
  .catch(error => {
    console.error("Erreur lors de l'ajout du film :", error);
  });
});