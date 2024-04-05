const movieListJSON = document.getElementById("movie-list-json");

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


const movieList = document.getElementById("movie-list-api");

// Fetch movies from the OMDB API
function fetchMoviesOMDB() {
    fetch("https://www.omdbapi.com/?i=tt3896198&apikey=8c8acf89")
   .then((response) => response.json())
   .then((movie) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${movie.Title}</strong> (${movie.Year}) - ${movie.Director} - <img src="${movie.Poster}" alt="${movie.Title} poster">`;
        movieList.appendChild(li);
    })
   .catch((error) => {
        console.error("Error fetching movies:", error);
    });
}

fetchMoviesOMDB();