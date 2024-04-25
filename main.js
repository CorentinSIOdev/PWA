import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import PushNotifications from 'node-pushnotifications';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Notifications
const publicVapidKey = "BBShyYWzVgh_tRShAUikcePxPAjh1Kg5a0TKNzZ_hLp8j9yg-scrIUOBerUlpFIiHfzTquJ1tQRgAfBGOdfz0H0";
const privateVapidKey = "lHIQ_Ppek0drPb0XOpysJyB2C0TbQxhvl8I-9j-fSXI";

app.post("/api/send_notification", (req, res) => {
  // Get pushSubscription object
  const { movieTitle, subscription } = req.body;
  
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

  // Send 201 - resource created
  const push = new PushNotifications(settings);

  // Create payload
  const payload = { title: "Un nouveau film est disponible !", body: "Le film " + movieTitle + " est maintenant disponible. Venez le découvrir !" };
  push.send(subscription, payload, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});

// Path to the JSON file containing the movies
const filmsFilePath = 'api_films.json';

// Route to create a new movie
app.post('/api/create_movie', async (req, res) => {
    // Get the title and imageUrl from the request body
    const { title, imageUrl } = req.body;

    // Check if the title and imageUrl are provided
    if (!title || !imageUrl) {
        return res.status(400).json({ error: 'Les champs title et imageUrl sont requis.' });
    }

    // Create a new film object
    const newFilm = { title, imageUrl };

    try {
        // Read the data from the JSON file
        let filmsData = [];
        
        try {
            const fileContent = fs.readFileSync(filmsFilePath, 'utf-8');
            filmsData = JSON.parse(fileContent);
        } catch (readError) {
            console.error('Erreur lors de la lecture du fichier JSON des films :', readError);
        }

        // Add the new film to the list of films
        filmsData.push(newFilm);

        // Write the updated data to the JSON file
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
