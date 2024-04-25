const movieListJSON = document.getElementById("movie-list-json");
const movieList = document.getElementById("movie-list-api");
const movieListPersonalAPI = document.getElementById("movie-list-api-perso");
const addMovieForm = document.getElementById("add-movie-form");

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
    // Send a notification if the permission is granted
    if ("Notification" in window && Notification.permission === "granted") {
      // Check if service worker is available
      if ("serviceWorker" in navigator) {
        send(title); // Send the notification
      }
    }
  })
 .catch(error => {
    console.error("Erreur lors de l'ajout du film :", error);
  });
});

// Notifications
document.addEventListener("DOMContentLoaded", function() {
  // Ask for permission to send notifications
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

const publicVapidKey = "BBShyYWzVgh_tRShAUikcePxPAjh1Kg5a0TKNzZ_hLp8j9yg-scrIUOBerUlpFIiHfzTquJ1tQRgAfBGOdfz0H0";

// Register SW, Register Push, Send Push
async function send(movieTitle) {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("./service-worker.js", {
    scope: "/",
  });
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push Registered...");

  // Send Push Notification
  console.log("Sending Push...");
  await fetch("http://localhost:3000/api/send_notification", {
    method: "POST",
    body: JSON.stringify({ movieTitle, subscription }),
    headers: {
      "content-type": "application/json",
    },
  });
  console.log("Push Sent...");
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}