import React, { StrictMode } from 'react'; // Importation du framework React pour la mise en place du FrontEnd
import ReactDOM from 'react-dom'; // Importation du plugin "ReactDOM" afin de faire afficher des éléments sur le DOM (interface de programmation normalisée par W3C consistant à hiérarchiser les éléments sous forme d'arble (parents/enfants))
import './index.css'; // Importation du fichier CSS
import App from './App'; // Importation du fichier APP.js (fichier React)

ReactDOM.render( // Utilisation de la méthode "ReactDOM.render" pour faire afficher des éléments sur le DOM
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root') // Mise en place des fichiers React sur l'élément contenant l'ID "root" (fichier index.html)
);