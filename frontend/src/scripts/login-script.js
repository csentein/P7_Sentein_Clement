// Début de la fonction login()
function login(event) {
    event.preventDefault()
    var data = { // Initialisation de la variable "data" et stockage des valeurs des inputs
        email: document.getElementById('login_input_email').value,
        password: document.getElementById('login_input_password').value,
    }

    fetch(`http://localhost:8080/api/users/login`, {
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
            console.log('data : ', data)
            if (data.firstName != null) { // S'il n'y a pas de message d'erreur renvoyé par le backend (voir fonction "login" du controlleur "user.js"), stockage de toutes les informations de connexion dans le localStorage)
                localStorage.setItem('token', data.token) // Stockage du token renvoyé par le backend (voir fonction "login" du controlleur "user.js") dans le localStorage (afin d'être utilisé dans le fichier App.js du frontend)
                localStorage.setItem('userId', data.userId)
                localStorage.setItem('isAdmin', data.isAdmin)
                localStorage.setItem('firstName', data.firstName)
                localStorage.setItem('lastName', data.lastName)
                localStorage.setItem('email', data.email)
                localStorage.setItem('avatarFile', data.avatarFile)
                document.location.href = '/'; // Une fois le stockage de toutes les informations réalisées, les utilisateurs sont redirigés vers la page "home" (page d'accueil au path "/")
            } else {
                alert('Le compte est introuvable') // Si l'adresse email n'est pas contenue dans la BDD (voir fonction "login" du controlleur "user.js"), envoi d'une alerte d'erreur
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    return false;

}
// Fin de la fonction login()

export default login;