import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const WEBPUSHR_API_KEY = 'adea10566f3398f4f8a368d27505a24d';
const WEBPUSHR_AUTH_TOKEN = '87621';

app.use(bodyParser.json());
app.use(cors());

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

        // Send a Push notification
        const notificationData = {
            title: 'Nouveau film ajouté',
            body: `${title} a été ajouté à la liste des films.`
        };
            
        const response = await fetch('https://api.webpushr.com/v1/notification/send/all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'webpushrKey': WEBPUSHR_API_KEY,
                'webpushrAuthToken': WEBPUSHR_AUTH_TOKEN,
            },
            body: JSON.stringify({
                title: notificationData.title,
                message: notificationData.body,
                target_url: 'https://127.0.0.1:5000',
                image: imageUrl
            })
        });
    
        // Check if the notification was sent successfully
        if (response.ok) {
            console.log('Notification Push envoyée avec succès.');
        } else {
            console.error('Erreur lors de l\'envoi de la notification Push :', response.statusText);
            return res.status(500).json({ error: 'Erreur lors de l\'envoi de la notification Push.' });
        }

        // Répondre avec le nouveau film ajouté
        res.status(201).json(newFilm);
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
