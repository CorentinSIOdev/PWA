import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

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
        try {
            const dataString = `{"title":"Nouveau film ajouté !","message":"Le film ${title} vient d'être ajouté !","target_url":"http://127.0.0.1:5500/"}`;
            const headers = {
                'webpushrKey': 'adea10566f3398f4f8a368d27505a24d',
                'webpushrAuthToken': '87621',
                'Content-Type': 'application/json'
            };
            const options = {
                url: 'https://api.webpushr.com/v1/notification/send/all',
                method: 'POST',
                headers: headers,
                body: dataString
            };
        
            const response = await fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: options.body
            });

            if (response.ok) {
                console.log('Push notification sent successfully');
                // Répondre avec le nouveau film ajouté
                res.status(201).json(newFilm);
            } else {
                console.error('Failed to send push notification:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error during push notification request:', error);
        }
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
