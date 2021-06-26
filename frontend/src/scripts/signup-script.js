// Début de la fonction "signup()" permettant de récupérer les valeurs des inputs (firstName, lastName, etc.), de les stocker dans la variable "data", de stocker ces données dans le localStorage depuis la réponse de l'appel Ajax et depuis la variable "data"
function signup(event) {
    event.preventDefault();

    var data = { // Stockage des valeurs des inputs (firstName, lastName, etc.) dans la variable "data"
        firstName: document.getElementById('input_first-name').value,
        lastName: document.getElementById('input_last-name').value,
        email: document.getElementById('input_email').value,
        password: document.getElementById('input_password').value,
    }

    fetch(`http://localhost:8080/api/users/signup`, {
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
        .then(response => {
            if (response.message == "L'utilisateur a bien été créé.") { // Si le message d'erreur n'est pas égal à "L'utilisateur existe déjà !", alors stockage des informations de compte dans le localStorage
                localStorage.setItem('token', response.token) // Mise en place du token dans le localStorage (ce token sera utilisé dans App.js pour permettre de faire afficher uniquement certains composants à l'utilisateur s'il dispose ou non de son token)
                localStorage.setItem('userId', response.userId)
                localStorage.setItem('isAdmin', 0) // Lors de l'inscription, le type de compte par défaut est "user" et non "admin"
                localStorage.setItem('firstName', data.firstName)
                localStorage.setItem('lastName', data.lastName)
                localStorage.setItem('avatarFile', "defaultavatar.png") // Lors de l'inscription, l'avatar par défaut est "defaultavatar.png"
                localStorage.setItem('email', data.email)
                document.location.href = '/'; // Une fois l'inscription utilisateur terminée, redirection vers la page principale 
            } else {
                alert("Erreur dans le processus de création du compte") // Si l'utilisateur existe déjà, envoi d'une alerte
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "signup()" permettant de récupérer les valeurs des inputs (firstName, lastName, etc.), de les stocker dans la variable "data", de stocker ces données dans le localStorage depuis la réponse de l'appel Ajax et depuis la variable "data"

export default signup