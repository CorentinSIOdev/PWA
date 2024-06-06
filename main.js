import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import PushNotifications from 'node-pushnotifications';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Notifications
const publicVapidKey = "BBShyYWzVgh_tRShAUikcePxPAjh1Kg5a0TKNzZ_hLp8j9yg-scrIUOBerUlpFIiHfzTquJ1tQRgAfBGOdfz0H0";
const privateVapidKey = "lHIQ_Ppek0drPb0XOpysJyB2C0TbQxhvl8I-9j-fSXI";

// Get public vapid key
app.get("/api/vapid_key", (req, res) => {
  res.json({ publicVapidKey });
})

app.post("/api/send_notification", (req, res) => {
  const { movieTitle, subscription, imageUrl } = req.body;

  const settings = {
    web: {
      vapidDetails: {
        subject: "mailto:pwa@project.com",
        publicKey: publicVapidKey,
        privateKey: privateVapidKey,
      },
      gcmAPIKey: "gcmkey",
      TTL: 2419200,
      contentEncoding: "aes128gcm",
      headers: {},
    },
    isAlwaysUseFCM: false,
  };

  const push = new PushNotifications(settings);
  const payload = {
    title: "Un nouveau film est disponible !",
    topic: "new-movie",
    body: "Le film " + movieTitle + " est maintenant disponible. Venez le découvrir !",
    priority: "high",
    icon: imageUrl,
    badge: 2,
  };

  push.send(subscription, payload, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de l'envoi de la notification." });
    } else {
      console.log(result);
      return res.status(200).json({ success: true });
    }
  });
});

// Path to the JSON file containing the movies
const filmsFilePath = 'data/api_movies.json';

// Route to create a new movie
app.post('/api/create_movie', async (req, res) => {
  // Récupérer le titre et l'URL de l'image du corps de la requête
  const { title, imageUrl } = req.body;

  // Vérifier si le titre, l'URL de l'image et l'abonnement sont fournis
  if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Les champs titre et imageUrl sont requis.' });
  }

  // Créer un nouvel objet film
  const newFilm = { title, imageUrl };

  try {
      // Lire les données à partir du fichier JSON
      let filmsData = [];
      
      try {
          const fileContent = fs.readFileSync(filmsFilePath, 'utf-8');
          filmsData = JSON.parse(fileContent);
      } catch (readError) {
          console.error('Erreur lors de la lecture du fichier JSON des films :', readError);
      }

      // Ajouter le nouveau film à la liste des films
      filmsData.push(newFilm);

      // Écrire les données mises à jour dans le fichier JSON
      fs.writeFileSync(filmsFilePath, JSON.stringify(filmsData, null, 2));

      return res.json(newFilm);
  } catch (error) {
      console.error('Erreur lors de la création du film :', error);
      res.status(500).json({ error: 'Une erreur est survenue lors de la création du film.' });
  }
});

// Get all movies from the json file
app.get('/api/movies', (req, res) => {
    try {
        const fileContent = fs.readFileSync(filmsFilePath, 'utf-8');
        const filmsData = JSON.parse(fileContent);
        res.json(filmsData);
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier JSON des films :', error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des films.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
