import React from 'react';
import '../styles/Login.css';
import '../scripts/login-script'
import login from '../scripts/login-script'

const Login = () => {
    return (
        <div className="login">

            <div className="login_links-container">
                <a href={'/connexion'} class="login_href login_href-first-child">Se connecter</a>
                <p class="login_href">|</p>
                <a href={'/inscription'} class="login_href">S'inscrire</a>
            </div>

            <form onSubmit={login} className="login_connexion-input-container">

                <input id="login_input_email" type="email" className="login_connexion-input" placeholder="Adresse email" required />
                <input id="login_input_password" type="password" className="login_connexion-input" placeholder="Mot de passe" required />

                <div className="login_button-container">
                    <button className="login_button">Se connecter</button>
                </div>

            </form>

        </div>

    );
};

export default Login; // Préparation à l'exportation de cette page Login pour le fichier App.js (frontend)