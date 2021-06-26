const express = require('express'); // Importation d'express, framework permettant de simplifier la création d'un serveur node.js
const bodyParser = require('body-parser'); // Importation de body-parser, plugin permettant d'extraire les corps de requêtes
const path = require('path'); // Importation de "path" permettant de gérer les chemins

// Plugins de sécurité
const helmet = require('helmet'); // Importation d'helmet, plugin permettant de sécuriser notre application Express grâce à différents entête des requêtes HTTP
const xss = require('xss-clean'); // Importation d'xss-clean, plugin permettant d'éviter les attaques XSS

require('dotenv').config(); // dotenv permet de copier les variables d'environnement dans un fichier externe .env. Dans notre cas, nous n'avons pas de variable d'environnement

// Importation des routes
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');

const app = express(); // Initialisation du serveur express

app.use(helmet());

// Gestion CORS (CORS = Cross-Origin Resource Sharing. Cela permet d'indiquer à un serveur d'autoriser toutes les autres origines que la sienne pour le chargement de ressources)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(xss());

app.use(express.json({ limit: '25mb' })); // Cette limite permet d'envoyer jusqu'à 50MB (pour les images)
app.use(express.urlencoded({ limit: '25mb' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require("./models/index"); // Importation de la configuration de la BDD
db.sequelize.sync(); // Connection à la BDD via sequelize

app.use('/api/users', userRoutes); // Mise en place de la route user
app.use('/api/posts', postRoutes); // Mise en place de la route post
app.use('/api/comments', commentRoutes); // Mise en place de la route comment

app.use('/images', express.static(path.join(__dirname, 'images'))); // Mise à disposition du dossier "images" grâce à la méthode express.static

module.exports = app;