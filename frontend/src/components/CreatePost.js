import React from 'react';
import '../styles/CreatePost.css';
import uploadPost from '../scripts/create-post';

const CreatePost = () => {
    var avatarFile = "http://localhost:8080/images/" + localStorage.getItem('avatarFile') // Récupération du path de l'avatar de l'utilisateur contenu dans le localStorage
    var placeholderText = "Que voulez-vous partager, " + localStorage.getItem('firstName') + " ?" // Récupération du firstName de l'utilisateur contenu dans le localStorage

    return (
        <div id="createpost_createpost-container" className="createpost_createpost">
            <div className="createpost_first-container">
                <img alt="Photo profil" class="createpost_photo-profil" src={avatarFile} />
                <textarea id="createpost_textarea" placeholder={placeholderText} class="createpost_textarea-createpost noselect"></textarea>
            </div>
            <div className="createpost_second-container">

                <input className="createpost_trigger" id="createpost_input_image-file" type="file" accept="image/jpg, image/jpeg, image/png" />

                <button className="createpost_trigger" onClick={uploadPost}>Publier <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="paper-plane" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-paper-plane fa-w-16 fa-3x createpost_svg-default"><path fill="currentColor" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z" class=""></path></svg></button>
            </div>
        </div >
    );
};

export default CreatePost;