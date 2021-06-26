import React from 'react'; // Importation du framework React (framework fonctionnant à l'aide de components)
import '../styles/Signup.css';
import '../scripts/signup-script'
import signup from '../scripts/signup-script'

const Signup = () => {
    return (
        <div className="signup">

            <div className="signup_links-container">
                <a href={'/connexion'} class="signup_href">Se connecter</a>
                <p class="signup_href">|</p>
                <a href={'/inscription'} class="signup_href signup_href-second-child">S'inscrire</a>
            </div>

            <form onSubmit={signup} className="signup_connexion-input-container">
                <div className="signup_firstname-lastname-input-container">

                    <input id="input_first-name" type="text" className="signup_firstname-input" placeholder="Prénom" required />
                    <input id="input_last-name" type="text" className="signup_lastname-input" placeholder="Nom" required />

                </div>
                <input id="input_email" type="email" className="signup_connexion-input" placeholder="Adresse email" required />
                <input id="input_password" type="password" className="signup_connexion-input" placeholder="Mot de passe" required />

                <div className="signup_button-container">
                    <button type="submit" className="signup_button">S'inscrire</button>
                </div>

            </form>

        </div>

    );
};

export default Signup; // Préparation à l'exportation de cette page Signup pour le fichier App.js (frontend)