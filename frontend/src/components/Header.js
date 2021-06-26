import React from 'react';
import '../styles/Header.css';

const Header = () => {

    return (
        <div className="header">
            <div>
            </div>

            <a href={'/'} class="logo-container">
                <img alt="Logo" className="header-logo" src="/icon-left-font-copie.png" />
            </a>

            <div className="header-navigation">

                <a href={'/connexion'} class="button-profil">
                    <p class="header_profil-name">Se connecter</p>
                    <img alt="Photo profil" class="photo-profil" src="http://localhost:8080/images/defaultavatar.png" />
                </a>
            </div>

        </div >
    );
};

export default Header;
