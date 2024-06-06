# Guide d'utilisation du Projet PWA

## Introduction

Ce guide fournit les instructions nécessaires pour démarrer et utiliser l'application PWA (Progressive Web App) associée à ce projet. Pour utiliser pleinement toutes les fonctionnalités de l'application, veuillez suivre attentivement les étapes ci-dessous.

## Prérequis

Avant de commencer, assurez-vous d'avoir Node.js installé sur votre système. Vous pouvez le télécharger depuis [ce lien](https://nodejs.org/).

## Installation

1. Téléchargez le projet depuis ce dépôt distant.

2. Ouvrez votre terminal de commande et naviguez vers le répertoire du projet.

3. Installez les dépendances en exécutant la commande suivante :

```
npm install
```

## Démarrage du Serveur

Une fois les dépendances installées, lancez le serveur en utilisant la commande suivante :

```
npm start
```

Assurez-vous que le serveur démarre correctement et que le message suivant s'affiche dans votre terminal :

```
> pwa@1.0.0 start
> nodemon main.js

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node main.js`
Serveur démarré sur le port 3000
```

## Hébergement de la Partie Client

Assurez-vous de lancer un serveur de type Go Live pour héberger la partie client. Vous devriez avoir un serveur lancé avec une adresse du type http://localhost:5500 ou http://127.0.0.1:5500 (par défaut).

## Utilisation de l'Application

1. Accédez à l'adresse d'hébergement de votre PWA dans un navigateur.

2. Lors de la première visite, une demande de permission pour les notifications apparaîtra. Acceptez cette demande pour continuer.

## Fonctionnalités de l'Application

### Liste des Films

L'interface comprend trois sections de listes de films :

1. Liste des Films JSON : Contient des films entrés manuellement dans un fichier JSON.

2. Liste des Films API Public : Affiche les films récupérés depuis une API tierce.

3. Liste des Films API Personnalisée : Présente les films récupérés depuis l'API du serveur Node.js.

### Création de Nouveaux Films

La section de la liste des films de l'API personnalisée contient un formulaire pour créer de nouveaux films. Une fois soumis, si la création est réussie, une notification sera émise pour informer les utilisateurs qu'un nouveau film a été ajouté.

### Mode Hors Ligne

L'application PWA propose également un mode hors ligne. Pour l'installer :

1. Accédez à l'onglet des extensions de votre navigateur.

2. Ouvrez l'application "Ma Super App De Films".

3. Cliquez sur le bouton "Ouvrir" ou "Installer" si ce n'est pas déjà fait.

L'application en mode hors ligne fournira une expérience similaire à celle du site web, avec des données de films mises en cache pour une utilisation hors ligne. Veuillez noter que la création de nouveaux films en mode hors ligne ne sera pas possible.

Les notifications fonctionnent également sur l'application si vous êtes connecté à internet.

## Captures d'écran

### Permission des Notifications

![Permission des Notifications](https://i.imgur.com/81qAlof.png)

### Liste des Films JSON

![Liste des Films JSON](https://i.imgur.com/yHFpNYn.png)

### Liste des Films API Public

![Liste des Films API Public](https://i.imgur.com/CStGNGw.png)

### Liste des Films API Personnalisée

![Liste des Films API Personnalisée](https://i.imgur.com/suJpJ4e.png)

### Notification Après Création d'un Film

![Notification Après Création d'un Film](https://i.imgur.com/Rjt29JK.png)

### Application PWA

![Application PWA](https://i.imgur.com/3hEPC8m.png)

----

Profitez de votre expérience avec l'application ! ✅