import React from 'react';
import '../styles/Account.css';
import '../scripts/account-script';

import updateAccount, { deconnexion, deleteAccount, setImage } from '../scripts/account-script'

// Initialisation de la variable Account
const Account = () => {
    // Cette variable contient le firstName, le lastName, l'email et l'avatarFile contenus dans le localStorage (cela nous permet de les faire afficher en placeholder des input)
    var firstName = localStorage.getItem('firstName')
    var lastName = localStorage.getItem('lastName')
    var email = localStorage.getItem('email')
    var avatarFile = "http://localhost:8080/images/" + localStorage.getItem('avatarFile')

    return (
        <div className="account">
            <div className="account_container">
                <img alt="Photo profil" id="account_avatar" class="account_imageprofil" src={avatarFile}>
                </img>

                <form onSubmit={updateAccount} className="account_form" enctype="multipart/form-data">
                    <div class="account_change-profil-picture-container">
                        <input onChange={setImage} id="account_input_avatar-file" class="account_change-profil-picture-a" type="file" accept="image/jpg, image/jpeg, image/png" />
                    </div>

                    <div class="account_change-profil-informations-container">
                        <div class="account_change-profil-informations-line">
                            Prénom<input id="account_input_first-name" class="account_change-profil-informations-input" placeholder={firstName}></input>
                        </div>
                        <div class="account_change-profil-informations-line">
                            Nom<input id="account_input_last-name" class="account_change-profil-informations-input" placeholder={lastName}></input>
                        </div>
                        <div class="account_change-profil-informations-line">
                            Email<input id="account_input_email" class="account_change-profil-informations-input" placeholder={email}></input>
                        </div>

                    </div>
                    <div className="account_button-container">
                        <button class="account_button" type="submit">
                            Enregistrer</button>
                    </div>
                </form>

                <button class="account_button" onClick={deconnexion}>
                    Se déconnecter</button>

                <button class="account_delete-account-container" onClick={deleteAccount}>
                    Supprimer le compte<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-trash-alt fa-w-14 fa-3x account_svg-default"><path fill="currentColor" d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" class=""></path></svg>
                </button>

            </div>
        </div>

    );
};

export default Account;