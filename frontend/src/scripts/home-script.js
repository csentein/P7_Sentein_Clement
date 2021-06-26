
let urlAfterSlash = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1'); // Initialisation de la variable "urlAfterSlash" et récupération de la chaîne de caractère après le dernier slash de l'url (ex. : mon-compte, etc.)
var profileUserId

// Si le userId contenu dans le localStorage est égal à null (utilisateur non connecté) et que l'utilisateur tente d'accéder à la page home, mon compte ou profil, il sera redirigé vers la page d'accueil
if (localStorage.getItem('userId') == null) {
    if (urlAfterSlash == '' || urlAfterSlash == 'mon-compte' || urlAfterSlash == 'profil') {
        document.location.href = "/connexion"
    }
} else // Si le userId n'est pas égal à null et que l'utilisateur tente d'accéder à la page home, il pourra y accéder et la fonction "getAllPosts()" sera appelée
{
    if (urlAfterSlash == '') {
        getAllPosts()
    }
}

// Début de la fonction "createComment(element)" permettant de créer un commentaire de post
function createComment(element) {
    let postId = element.getAttribute('data-post-id') // Initialisation de la variable "postId" et récupération des éléments (HTML) possédant l'attribut "data-post-id"
    let data = { // Initialisation de la variable "data" contenant le contenu du commentaire, l'userId de l'utilisateur ayant posté le commentaire ainsi que le postId du post du commentaire
        content: document.getElementById(`comment_create-comment-textarea-${postId}`).value,
        userId: localStorage.getItem('userId'),
        postId
    }

    fetch(`http://localhost:8080/api/comments/createcomment`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(() => {
            document.location.href = "/" // Si la requête AJAX est conforme, la page est rechargée
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "createComment(element)" permettant de créer un commentaire de post

// Début de la fonction "extractNumber" permettant d'extraire les nombres d'une chaîne de caractères
function extractNumber(string) {
    return string.match(/\d+/g)[0]
}
// Fin de la fonction "extractNumber" permettant d'extraire les nombres d'une chaîne de caractères

// Début de la fonction "likeDislikePost(element)" permettant de liker ou de dislier les posts
function likeDislikePost(element) {
    let postId = element.getAttribute('data-post-id')
    let likeDislike = element.getAttribute('data-like-dislike')
    let likedDisliked
    let altElement
    element.classList.toggle('like_dislike_active') // Basculement de la class "like_dislike_active" pour faire afficher la couleur verte ou rouge (voir fichier Home.css)
    let childElement = element.querySelector('.post_numberlikes');
    let number
    if (element.classList.contains("like_dislike_active")) { // Si la classe de l'élément contient "like_dislike_active", alors on ajoute "1" à la variable "likedDisliked" (qui sera renvoyée au backend) ainsi que "1" à "number" qui servira a faire afficher le nombre de likes en Frontend
        likedDisliked = 1 // 1 = like
        number = parseInt(extractNumber(childElement.innerText)) + 1 // Ajout d'un like (ou dislike) au nombre précédent
        childElement.innerText = "(" + number + ")"
    } else { // Sinon, on attribue 0 à "likedDisliked" (valeur d'un dislike)
        likedDisliked = 0 // 0 = dislike
        number = parseInt(extractNumber(childElement.innerText)) - 1 // Retrait d'un like (ou dislike) au nombre précédent
        childElement.innerText = "(" + number + ")"
    }
    if (likeDislike == 0) { // Si "likeDislike" est égal à 0 (soit un le bouton dislike cliqué) (valeur de l'élement contenant l'attribut "data-like-dislike"), on réalise la fonction suivante : 
        altElement = document.getElementById('post_like_trigger_' + postId) // altElement correspond à l'autre pouce n'ayant pas été cliqué. Cela permet de retirer le pouce rouge si le pouce vert est cliqué et inversement. En l'occurence, il correspond actuellement au bouton like.
    } else { // Sinon (like ajouté), on attribut l'élément dynamique "post_dislike_trigger_' + postId" à "altElement"
        altElement = document.getElementById('post_dislike_trigger_' + postId) // On attribut l'élément contenant l'ID dynamique "post_like_trigger_' + postId" à la variable "altElement"
    }

    if (altElement.classList.contains("like_dislike_active")) {
        altElement.classList.remove('like_dislike_active') // Si le bouton like est cliqué et que le bouton dislike était déjà cliqué, on retire la classe permettant de faire afficher la couleur du bouton

        let altChildElement = altElement.querySelector('.post_numberlikes'); // Attribution de l'élément contenant la classe "post_numberlikes" à altChildElement
        number = parseInt(extractNumber(altChildElement.innerText)) - 1 // Retrait d'un like (ou dislike) au nombre précédent de la classe alternative
        altChildElement.innerText = "(" + number + ")"
    }

    let data = { // Initialisation de la variable "data" et envoi des informations importantes
        userId: localStorage.getItem('userId'),
        postId, // Id du post ayant reçu un like ou dislike
        likeDislike, // Si "likeDislike" est égal à 1 : like ajouté. Si "likeDislike" est égal à 0 : dislike ajouté.
        likedDisliked // Si "likedDisliked" est égal à 1 pour les likes : like supprimé à l'ajout du dislike et inversement
    }

    fetch(`http://localhost:8080/api/posts/likepost`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "likeDislikePost(element)" permettant de liker ou de disliker les posts

// Début de la fonction "likeDislikeComment(element)" permettant de liker ou ou disliker les commentaires (fonctionnement similaire au like/dislike des posts)
function likeDislikeComment(element) {
    let commentId = element.getAttribute('data-comment-id')
    let likeDislike = element.getAttribute('data-like-dislike')
    let likedDisliked
    let altElement
    element.classList.toggle('like_dislike_active')
    let childElement = element.querySelector('.comment_numberlikes');
    let number
    if (element.classList.contains("like_dislike_active")) {
        likedDisliked = 1
        number = parseInt(extractNumber(childElement.innerText)) + 1
        childElement.innerText = "(" + number + ")"
    } else {
        likedDisliked = 0
        number = parseInt(extractNumber(childElement.innerText)) - 1
        childElement.innerText = "(" + number + ")"
    }
    if (likeDislike == 0) {
        altElement = document.getElementById('comment_like_trigger_' + commentId)
    } else {
        altElement = document.getElementById('comment_dislike_trigger_' + commentId)
    }

    if (altElement.classList.contains("like_dislike_active")) {
        altElement.classList.remove('like_dislike_active')

        let altChildElement = altElement.querySelector('.comment_numberlikes');
        number = parseInt(extractNumber(altChildElement.innerText)) - 1
        altChildElement.innerText = "(" + number + ")"
    }

    let data = {
        userId: localStorage.getItem('userId'),
        commentId,
        likeDislike,
        likedDisliked
    }

    fetch(`http://localhost:8080/api/comments/likecomment`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "likeDislikeComment(element)" permettant de liker ou ou disliker les commentaires (fonctionnement similaire au like/dislike des posts)

// Début de la fonction "timeSince(date)" permettant de convertir sert la date recue par la BDD en "Il y a 30 minutes" (pour les commentaires de posts)
function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " années";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " mois";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " jours";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " heures";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " secondes";
}
// Fin de la fonction "timeSince(date)" permettant de convertir sert la date recue par la BDD en "Il y a 30 minutes" (pour les commentaires de posts)

// Début de la fonction "removePost(element)" permettant de supprimer un post
function removePost(element) {
    let postId = element.getAttribute('data-post-id') // Récupération de l'élément contenant l'attribut "data-post-id" (en fonction du paramètre)
    element.remove() // Méthode ".remove()" permettant de supprimer visuellement l'élément

    let data = { // Initialisation de la variable "data" contenant l'userId et le postId. Cet envoi permettra au backend de supprimer le post identifié grâce à son postId 
        userId: localStorage.getItem('userId'),
        postId
    }

    fetch(`http://localhost:8080/api/posts/removepost`, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "removePost(element)" permettant de supprimer un post

// Début de la fonction "removeComment(element)" permettant de supprimer un commentaire (fonctionnement similaire à la fonction ci-dessus)
function removeComment(element) {
    let commentId = element.getAttribute('data-comment-id')
    element.remove()

    let data = {
        userId: localStorage.getItem('userId'),
        commentId
    }

    fetch(`http://localhost:8080/api/comments/removecomment`, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "removeComment(element)" permettant de supprimer un commentaire (fonctionnement similaire à la fonction ci-dessus)

// Début de la fonction "getAllPosts()" permettant de récupérer tous les posts et les faire afficher dans la page "home"
async function getAllPosts() {
    var url = new URL(window.location.href);
    profileUserId = url.searchParams.get("user_id"); // Récupération de l'UserId contenu dans l'URL pour la page profil (ci-dessus)

    fetch(`http://localhost:8080/api/posts/?profileuserid=${profileUserId}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
        .then(response => response.json())
        .then(data => {
            let posts = data
            if (document.getElementById('home_container') == null) { // Débogage en cas d'erreur
                return
            }
            let postCross = '' // Initialisation de la variable "postCross" qui permettra de faire afficher une croix aux posts pour les comptes administrateurs
            let commentCross = '' // Initialisation de la variable "commentCross" qui permettra de faire afficher une croix aux commentaires pour les comptes administrateurs

            if (localStorage.getItem('isAdmin') == 'true') { // Si l'utilisateur a un compte administrateur, création des croix pour les posts et les commentaires
                postCross = `<button class="top-right-cross cross_post">x</button>`
                commentCross = `<button onclick="removeComment(this)" class="top-right-cross cross_comment">x</button>`
            }

            let html = ''
            for (let i = 0; i < posts.length; i++) { // Boucle permettant d'initialiser le code HTML pour créer les posts
                let currentPost = posts[i]
                let date = new Date(currentPost.createdAt).toLocaleDateString() // Affichage de la date des posts au format local de l'utilisateur (Ex. : En France, le format est : DD/MM/YYYY)
                let postLikeLiked = ''
                let postDislikeDisliked = ''

                for (let i = 0; i < currentPost.reactions.length; i++) {
                    let currentReaction = currentPost.reactions[i]
                    if (currentReaction.authorId == localStorage.getItem('userId')) {
                        if (currentReaction.reaction == 1) {
                            postLikeLiked = 'like_dislike_active'
                        } else {
                            postDislikeDisliked = 'like_dislike_active'
                        }
                    }
                }

                let likes = 0
                let dislikes = 0

                for (let i = 0; i < currentPost.reactions.length; i++) {
                    let currentReaction = currentPost.reactions[i]
                    if (currentReaction.reaction == false) {
                        dislikes++
                    } else {
                        likes++
                    }
                }

                html += `
                    
                <div data-post-id="${currentPost.id}" class="post_post"> 
                ${postCross}

                    <div class="post_first-container">
                        <img alt="Photo profil" class="post_photo-profil" src="http://localhost:8080/images/${currentPost.author.avatarFile}" />
                        <div class="post_sub-first-container">
                            <a href="/?user_id=${currentPost.authorId}" class="post_profil-name">${currentPost.author.firstName} ${currentPost.author.lastName}</a>
                            <p class="post_date-post">${date}</p>
                        </div>
                    </div>
                    <div class="post_second-container">

                        <p class="post_comment_second-container">${currentPost.content}
                        </p>
                        `
                if (currentPost.imageFile != null && currentPost.imageFile.length > 0) // Si le post généré possède une image, on génère le code HTML suivant
                    html += `<img alt="Photo profil" class="post_comment_image" src="http://localhost:8080/images/${currentPost.imageFile}"/>`
                html += `
                        <div class="post_sub-second-container">

                            <button id="post_like_trigger_${currentPost.id}" class="post_trigger post_like_dislike_post ${postLikeLiked}" data-like-dislike="1" data-post-id="${currentPost.id}">
                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="thumbs-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-thumbs-up fa-w-16 fa-3x post_svg-default post_thumbs-up"><path fill="currentColor" d="M466.27 286.69C475.04 271.84 480 256 480 236.85c0-44.015-37.218-85.58-85.82-85.58H357.7c4.92-12.81 8.85-28.13 8.85-46.54C366.55 31.936 328.86 0 271.28 0c-61.607 0-58.093 94.933-71.76 108.6-22.747 22.747-49.615 66.447-68.76 83.4H32c-17.673 0-32 14.327-32 32v240c0 17.673 14.327 32 32 32h64c14.893 0 27.408-10.174 30.978-23.95 44.509 1.001 75.06 39.94 177.802 39.94 7.22 0 15.22.01 22.22.01 77.117 0 111.986-39.423 112.94-95.33 13.319-18.425 20.299-43.122 17.34-66.99 9.854-18.452 13.664-40.343 8.99-62.99zm-61.75 53.83c12.56 21.13 1.26 49.41-13.94 57.57 7.7 48.78-17.608 65.9-53.12 65.9h-37.82c-71.639 0-118.029-37.82-171.64-37.82V240h10.92c28.36 0 67.98-70.89 94.54-97.46 28.36-28.36 18.91-75.63 37.82-94.54 47.27 0 47.27 32.98 47.27 56.73 0 39.17-28.36 56.72-28.36 94.54h103.99c21.11 0 37.73 18.91 37.82 37.82.09 18.9-12.82 37.81-22.27 37.81 13.489 14.555 16.371 45.236-5.21 65.62zM88 432c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24 24 10.745 24 24z" class=""></path></svg>
                                <p class="post_numberlikes">(${likes})</p>
                            </button>
                            <button id="post_dislike_trigger_${currentPost.id}" class="post_trigger post_margin-bottom post_like_dislike_post ${postDislikeDisliked}" data-like-dislike="0" data-post-id="${currentPost.id}">
                                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="thumbs-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-thumbs-down fa-w-16 fa-3x post_svg-default post_thumbs-down"><path fill="currentColor" d="M466.27 225.31c4.674-22.647.864-44.538-8.99-62.99 2.958-23.868-4.021-48.565-17.34-66.99C438.986 39.423 404.117 0 327 0c-7 0-15 .01-22.22.01C201.195.01 168.997 40 128 40h-10.845c-5.64-4.975-13.042-8-21.155-8H32C14.327 32 0 46.327 0 64v240c0 17.673 14.327 32 32 32h64c11.842 0 22.175-6.438 27.708-16h7.052c19.146 16.953 46.013 60.653 68.76 83.4 13.667 13.667 10.153 108.6 71.76 108.6 57.58 0 95.27-31.936 95.27-104.73 0-18.41-3.93-33.73-8.85-46.54h36.48c48.602 0 85.82-41.565 85.82-85.58 0-19.15-4.96-34.99-13.73-49.84zM64 296c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zm330.18 16.73H290.19c0 37.82 28.36 55.37 28.36 94.54 0 23.75 0 56.73-47.27 56.73-18.91-18.91-9.46-66.18-37.82-94.54C206.9 342.89 167.28 272 138.92 272H128V85.83c53.611 0 100.001-37.82 171.64-37.82h37.82c35.512 0 60.82 17.12 53.12 65.9 15.2 8.16 26.5 36.44 13.94 57.57 21.581 20.384 18.699 51.065 5.21 65.62 9.45 0 22.36 18.91 22.27 37.81-.09 18.91-16.71 37.82-37.82 37.82z" class=""></path></svg>
                                <p class="post_numberlikes">(${dislikes})</p>
                            </button>

                        </div>

                    </div>

                    <div class="post_horizontal-barre"></div>`

                for (let i = 0; i < currentPost.comments.length; i++) { // Boucle permettant la génération des commentaires
                    let currentComment = currentPost.comments[i];
                    console.log(currentComment.createdAt)

                    let date = 'Il y a ' + timeSince(new Date(currentComment.createdAt)) // Ajout de la date du commentaire au format "Il y a 5 heures" grâce à la fonction "timeSince"

                    let commentLikeLiked = ''
                    let commentDislikeDisliked = ''

                    for (let i = 0; i < currentComment.reactions.length; i++) {
                        let currentReaction = currentComment.reactions[i]
                        if (currentReaction.authorId == localStorage.getItem('userId')) {
                            if (currentReaction.reaction == 1) {
                                commentLikeLiked = 'like_dislike_active'
                            } else {
                                commentDislikeDisliked = 'like_dislike_active'
                            }
                        }
                    }

                    let likes = 0
                    let dislikes = 0

                    for (let i = 0; i < currentComment.reactions.length; i++) {
                        let currentReaction = currentComment.reactions[i]
                        if (currentReaction.reaction == false) {
                            dislikes++
                        } else {
                            likes++
                        }
                    }

                    html += `

                    <div class="post_third-container" data-comment-id="${currentComment.id}">
                    ${commentCross}
                        <div class="post_first-sub-third-container">
                            <img alt="Photo profil" class="post_photo-profil" src="http://localhost:8080/images/${currentComment.author.avatarFile}" />
                            <div class="post_sub-third-container">
                                <a href="/?user_id=${currentPost.authorId}" class="post_profil-name-comment">${currentComment.author.firstName} ${currentComment.author.lastName}</a>
                                <p class="post_text-comment">${currentComment.content}</p>
                            </div>
                        </div>
                        <div class="post_sub_comment">

                            <p class="post_date-comment">${date}</p>
                            <div class="post_like-dislike-comment">

                                <button id="comment_like_trigger_${currentComment.id}" class="post_trigger comment_like_dislike_comment ${commentLikeLiked}" data-comment-id="${currentComment.id}" data-like-dislike="1">
                                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="thumbs-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-thumbs-up fa-w-16 fa-3x post_svg-default-comment post_thumbs-up"><path fill="currentColor" d="M466.27 286.69C475.04 271.84 480 256 480 236.85c0-44.015-37.218-85.58-85.82-85.58H357.7c4.92-12.81 8.85-28.13 8.85-46.54C366.55 31.936 328.86 0 271.28 0c-61.607 0-58.093 94.933-71.76 108.6-22.747 22.747-49.615 66.447-68.76 83.4H32c-17.673 0-32 14.327-32 32v240c0 17.673 14.327 32 32 32h64c14.893 0 27.408-10.174 30.978-23.95 44.509 1.001 75.06 39.94 177.802 39.94 7.22 0 15.22.01 22.22.01 77.117 0 111.986-39.423 112.94-95.33 13.319-18.425 20.299-43.122 17.34-66.99 9.854-18.452 13.664-40.343 8.99-62.99zm-61.75 53.83c12.56 21.13 1.26 49.41-13.94 57.57 7.7 48.78-17.608 65.9-53.12 65.9h-37.82c-71.639 0-118.029-37.82-171.64-37.82V240h10.92c28.36 0 67.98-70.89 94.54-97.46 28.36-28.36 18.91-75.63 37.82-94.54 47.27 0 47.27 32.98 47.27 56.73 0 39.17-28.36 56.72-28.36 94.54h103.99c21.11 0 37.73 18.91 37.82 37.82.09 18.9-12.82 37.81-22.27 37.81 13.489 14.555 16.371 45.236-5.21 65.62zM88 432c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24 24 10.745 24 24z" class=""></path></svg>
                                    <p class="comment_numberlikes">(${likes})</p>
                                </button>

                                <button id="comment_dislike_trigger_${currentComment.id}" class="post_trigger post_margin-bottom comment_like_dislike_comment ${commentDislikeDisliked}" data-comment-id="${currentComment.id}" data-like-dislike="0">
                                    <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="thumbs-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-thumbs-down fa-w-16 fa-3x post_svg-default-comment post_thumbs-down"><path fill="currentColor" d="M466.27 225.31c4.674-22.647.864-44.538-8.99-62.99 2.958-23.868-4.021-48.565-17.34-66.99C438.986 39.423 404.117 0 327 0c-7 0-15 .01-22.22.01C201.195.01 168.997 40 128 40h-10.845c-5.64-4.975-13.042-8-21.155-8H32C14.327 32 0 46.327 0 64v240c0 17.673 14.327 32 32 32h64c11.842 0 22.175-6.438 27.708-16h7.052c19.146 16.953 46.013 60.653 68.76 83.4 13.667 13.667 10.153 108.6 71.76 108.6 57.58 0 95.27-31.936 95.27-104.73 0-18.41-3.93-33.73-8.85-46.54h36.48c48.602 0 85.82-41.565 85.82-85.58 0-19.15-4.96-34.99-13.73-49.84zM64 296c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zm330.18 16.73H290.19c0 37.82 28.36 55.37 28.36 94.54 0 23.75 0 56.73-47.27 56.73-18.91-18.91-9.46-66.18-37.82-94.54C206.9 342.89 167.28 272 138.92 272H128V85.83c53.611 0 100.001-37.82 171.64-37.82h37.82c35.512 0 60.82 17.12 53.12 65.9 15.2 8.16 26.5 36.44 13.94 57.57 21.581 20.384 18.699 51.065 5.21 65.62 9.45 0 22.36 18.91 22.27 37.81-.09 18.91-16.71 37.82-37.82 37.82z" class=""></path></svg>
                                    <p class="comment_numberlikes">(${dislikes})</p>
                                </button>

                            </div>
                        </div>

                    </div>`
                }
                // Création du container permettant d'écrire un commentaire
                html += `
                    <div class="post_fourth-container">
                        <div class="post_first-sub-third-container">
                            <img alt="Photo profil" class="post_photo-profil" src="http://localhost:8080/images/${localStorage.getItem('avatarFile')}" />
                            <div class="post_sub-comment-third-container">
                                <textarea id="comment_create-comment-textarea-${currentPost.id}" placeholder="Écrivez un commentaire..." class="post_textarea-createcomment noselect"></textarea>

                            </div>
                        </div>
                        <div class="post_button-comment-container">
                            <button class="post_button-comment" data-post-id="${currentPost.id}">Envoyer</button>
                        </div>
                    </div>
                </div>`
            }

            document.getElementById('home_container').insertAdjacentHTML('beforeend', html) // Génération de l'HTML à l'élément contenant l'ID "home_container" grâce à la méthode "insertAdjacentHTML" (méthode permettant de ne pas remplacer le code HTML déjà généré et d'en générer plusieurs). Beforeend = localisation de l'ajout de l'HTML (chaque génération d'HTML se mettent à la suite)

            Array.from(document.getElementsByClassName("post_button-comment")).forEach(function (element) { // On parcours tous les éléments contenant la classe "post-button-comment" et on rajoute la fonction "createComment(this)" grâce à la méthode "addEventListener" (document.getElementsByClassName("post_button-comment") nous renvoit une liste de tous les éléments, d'où l'utilisation de "Array.from" et de "forEach")
                element.addEventListener('click', function () {
                    createComment(this)
                }, false);
            });

            Array.from(document.getElementsByClassName("post_like_dislike_post")).forEach(function (element) { // Ajout de la fonction "likeDislikePost" pour les éléments contenant la classe "post_like_dislike_post" (like/dislike des posts)
                element.addEventListener('click', function () {
                    likeDislikePost(this)
                }, false);
            });

            Array.from(document.getElementsByClassName("comment_like_dislike_comment")).forEach(function (element) { // Ajout de la fonction "likeDislikeComment" pour les éléments contenant la classe "comment_like_dislike_comment" (like/dislike des commentaires)
                element.addEventListener('click', function () {
                    likeDislikeComment(this)
                }, false);
            });

            Array.from(document.getElementsByClassName("cross_post")).forEach(function (element) { // Ajout de la fonction "removePost" pour les éléments contenant la classe "cross_post" (croix des posts)
                element.addEventListener('click', function () {
                    removePost(this.parentNode)
                }, false);
            });

            Array.from(document.getElementsByClassName("cross_comment")).forEach(function (element) { // Ajout de la fonction "removeComment" pour les éléments contenant la classe "cross_comment" (croix des commentaires)
                element.addEventListener('click', function () {
                    removeComment(this.parentNode)
                }, false);
            });

            if (profileUserId != null) { // (PAGE PROFIL) Si la variable "profileUserId" n'est pas égale à null, on réalise le code suivant
                document.getElementById('createpost_createpost-container').remove() // Suppression de l'élément HTML contenant l'ID "createpost_createpost-container" (contenu dans CreatePost.js)
                let name
                let avatarFile

                if (posts[0] != null) { // S'il y a bien un post récupéré, réalisation de la boucle suivante
                    name = posts[0].author.firstName + " " + posts[0].author.lastName // Récupération du firstname ainsi que du lastname de l'utilisateur ayant créé le post généré
                    avatarFile = posts[0].author.avatarFile // Récupération de l'url de l'avatar de l'utilisateur ayant créé le post en question
                } else {
                    name = posts.firstName + " " + posts.lastName // S'il n'y a pas de post, on récupère tout de même le first name, le last name et l'image url (au travers d'une autre requête SQL en backend) et on fait afficher les informations reçues
                    avatarFile = posts.avatarFile
                }

                // Génération de l'HTML du top de la page profil
                document.getElementById('home_container').insertAdjacentHTML('afterbegin', `
                <div class="profil_container">
                    <div class="profil">
                        <p class="profil_p">Publications de <span class="profil_name">${name}</span></p>
                        <img alt="Photo profil" class="profil_photo-profil" src="http://localhost:8080/images/${avatarFile}" />
                    </div>
                </div>`)
            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "getAllPosts()" permettant de récupérer tous les posts et les faire afficher dans la page "home"