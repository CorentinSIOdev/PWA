const movieListJSON = document.getElementById("movie-list-json");
const movieList = document.getElementById("movie-list-api");
const notificationContainer = document.getElementById("notification-container");
const notificationIcon = document.getElementById("notification-icon");
const notificationCounter = document.getElementById("notification-counter");
const notificationList = document.getElementById("notification-list");

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
      // Iterate through the results array
      movie.results.forEach(result => {
          // Create a new list item
          const li = document.createElement("li");
          // Set the text content to the movie title
          li.textContent = result.title;
          // Create an image element for the movie poster
          const img = document.createElement("img");
          // Set the source of the image to the movie poster path
          img.src = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
          // Set the alt text of the image to the movie title
          img.alt = result.title;
          // Append the image to the list item
          li.appendChild(img);
          // Append the list item to the movie list
          movieList.appendChild(li);
      });
    })
   .catch((error) => {
        console.error("Error fetching movies:", error);
    });
}

fetchMoviesOMDB();

// Méthode pour afficher une notification Push
function showPushNotification(data) {
  const notificationItem = document.createElement("div");
  notificationItem.classList.add("notification-item");
  notificationItem.textContent = data.body;
  notificationList.appendChild(notificationItem);
  
  unreadNotifications++;
  updateNotificationCounter();
}

// Initialisation de la notification Push
function initializePushNotifications() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission(permission => {
          if (permission === 'granted') {
              navigator.serviceWorker.ready
                  .then(registration => registration.pushManager.subscribe({ userVisibleOnly: true }))
                  .then(subscription => {
                      console.log('Abonnement réussi :', subscription);
                  })
                  .catch(error => console.error('Erreur lors de l\'abonnement aux notifications Push :', error));
          }
      });
  }
}

// Écouter les notifications Push
function listenForPushNotifications() {
  navigator.serviceWorker.addEventListener('message', event => {
      const { type, data } = event.data;
      if (type === 'push-notification') {
          showPushNotification(data);
      }
  });
}

// Initialisation de l'écoute des notifications Push
initializePushNotifications();

// Écoute des notifications Push
listenForPushNotifications();
