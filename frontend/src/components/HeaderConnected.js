import React from 'react';
import '../styles/HeaderConnected.css';

const HeaderConnected = () => {
    var name = localStorage.getItem('firstName') + " " + localStorage.getItem('lastName')
    var avatarFile = "http://localhost:8080/images/" + localStorage.getItem('avatarFile')

    return (
        <div className="header">

            <a href={'/'} class="logo-container">
                <img alt="Logo" className="header-logo" src="/icon-left-font-copie.png" />
            </a>

            <div className="header-navigation">

                <a href={'/mon-compte'} class="button-profil">
                    <p class="header_profil-name">{name}</p>
                    <img alt="Photo profil" class="photo-profil" src={avatarFile} />
                </a>
            </div>

        </div >
    );
};

export default HeaderConnected;
