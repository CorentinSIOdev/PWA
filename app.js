const movieListJSON = document.getElementById("movie-list-json");
const movieList = document.getElementById("movie-list-api");
const movieListPersonalAPI = document.getElementById("movie-list-api-perso");
const addMovieForm = document.getElementById("add-movie-form");

// Fonction pour récupérer la clé VAPID depuis le serveur
async function fetchVapidKey() {
  try {
    const response = await fetch("http://localhost:3000/api/vapid_key");
    const data = await response.json();
    return data.publicVapidKey;
  } catch (error) {
    console.error("Erreur lors de la récupération de la clé VAPID :", error);
    throw error;
  }
}

// Fonction pour demander la permission de notification
async function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
}

// Fonction pour envoyer une notification
async function sendNotification(movieTitle, imageUrl) {
  if ("Notification" in window && Notification.permission === "granted") {
    if ("serviceWorker" in navigator) {
      try {
        // Enregistrer le service worker
        const register = await navigator.serviceWorker.register("./services/service-worker.js", {
          scope: "/services/",
        });

        // Obtenir la clé VAPID
        const publicVapidKey = await fetchVapidKey();

        // Obtenir l'abonnement pour les notifications push
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // Envoyer la notification
        await fetch("http://localhost:3000/api/send_notification", {
          method: "POST",
          body: JSON.stringify({ movieTitle, subscription, imageUrl }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification :", error);
      }
    }
  }
}

// Écouteur d'événement pour le formulaire d'ajout de film
addMovieForm.addEventListener("submit", async function(event) {
  event.preventDefault();

  const formData = new FormData(addMovieForm);
  const title = formData.get("title");
  const imageUrl = formData.get("imageUrl");

  try {
    // Envoi de la demande d'ajout de film à l'API
    const response = await fetch("http://localhost:3000/api/create_movie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, imageUrl }),
    });

    if (!response.ok) {
      console.error("Erreur lors de l'ajout du film :", response.json());
      throw new Error("Erreur lors de l'ajout du film");
    }

    // Envoi de la notification si l'ajout est réussi
    await sendNotification(title, imageUrl);
  } catch (error) {
    console.error("Erreur lors de l'ajout du film :", error);
  }
});

// Fonction pour récupérer les films depuis un fichier JSON local
async function fetchMoviesJSON() {
  try {
    const response = await fetch("data/local_movies.json");
    const movies = await response.json();

    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${movie.title}</strong> (${movie.year}) - ${movie.director} - <img src="${movie.poster}" alt="${movie.title} poster">`;
      movieListJSON.appendChild(li);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des films depuis le fichier JSON local :", error);
  }
}

// Fonction pour récupérer les films depuis l'API OMDB
async function fetchMoviesOMDB() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTkzN2U1MTBiYWQxZjk3ZDFhZWZiOTlmNDdkMTc0OCIsInN1YiI6IjY2MjYyZjFjNjJmMzM1MDE0YmQ3ZjZmOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xutUM_YudU8T0QjI012qzPiKdwZCnfSmwH9sVgzVevY'
    }
  };

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=fr-FR&page=1', options);
    const movieData = await response.json();

    movieData.results.forEach((movie) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${movie.title}</strong> <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">`;
      movieList.appendChild(li);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des films depuis l'API OMDB :", error);
  }
}

// Fonction pour récupérer les films depuis l'API personnalisée
async function fetchMoviesAPI() {
  try {
    const response = await fetch("http://localhost:3000/api/movies");
    const movies = await response.json();

    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${movie.title}</strong> <img src="${movie.imageUrl}" alt="${movie.title} poster">`;
      movieListPersonalAPI.appendChild(li);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des films depuis l'API personnalisée :", error);
  }
}

// Lancement des fonctions au chargement de la page
document.addEventListener("DOMContentLoaded", async function() {
  await requestNotificationPermission();
  await fetchMoviesJSON();
  await fetchMoviesOMDB();
  await fetchMoviesAPI();
});

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