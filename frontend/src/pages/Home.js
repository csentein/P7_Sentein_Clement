import React from 'react'; // Importation du framework React (framework fonctionnant à l'aide de components)
import CreatePost from '../components/CreatePost'; // Importation du component (composant) "CreatePost"
import '../styles/Home.css';
import '../styles/Post.css';
import '../styles/Profil.css';
import '../scripts/home-script'

const Home = () => {

    return (
        <div id="home_container" className="home">
            <CreatePost />
        </div>
    );
};

export default Home; // Préparation à l'exportation de la page "Home" pour le fichier App.js (frontend)