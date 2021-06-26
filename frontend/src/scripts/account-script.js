// Début de la fonction "deconnexion" permettant de supprimer tous les éléments pour identifier l'utilisateur contenus dans le localStorage et de rediriger vers la page de connexion
function deconnexion() {
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    localStorage.removeItem('avatarFile')
    localStorage.removeItem('email')

    document.location.href = "/connexion"
}
// Fin de la fonction "deconnexion" permettant de supprimer tous les éléments pour identifier l'utilisateur contenus dans le localStorage et de rediriger vers la page de connexion

// Début de la fonction "deleteAccount" permettant de supprimer le compte
function deleteAccount() {
    let userId = localStorage.getItem('userId') // Récupération de l'userId contenu dans le localStorage

    fetch(`http://localhost:8080/api/users/remove`, {
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
        body: JSON.stringify({ userId })
    })
        .then(response => response.json())
        .then(data => {
            deconnexion() // Appel de la fonction "deconnexion()"
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction "deleteAccount" permettant de supprimer le compte

// Début de la fonction "encodeImageFileAsURL" permettant de convertir l'image en base64 (pour, par la suite, l'envoyer au backend dans une requête AJAX)
function encodeImageFileAsURL(element) {
    return new Promise((resolve) => {
        var file = element.files[0];
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
    })
}
// Fin de la fonction "encodeImageFileAsURL" permettant de convertir l'image en base64 (pour, par la suite, l'envoyer au backend dans une requête AJAX)

var avatarFileBase64

// Début de la fonction "setImage" permettant de faire afficher l'image directement sur le DOM (fonction asynchrone)
async function setImage() {
    var avatarFileInput = document.getElementById('account_input_avatar-file')
    avatarFileBase64 = await encodeImageFileAsURL(avatarFileInput)
    document.getElementById('account_avatar').setAttribute('src', avatarFileBase64)
}
// Fin de la fonction "setImage" permettant de faire afficher l'image directement sur le DOM (fonction asynchrone)

// Début de la fonction "updateAccount" permettant de mettre à jour un compte utilisateur
async function updateAccount(event) {
    event.preventDefault()
    var avatarFileInput = document.getElementById('account_input_avatar-file')

    let avatarFile = {}
    if (avatarFileInput.files != null && avatarFileInput.files[0] != null) {
        avatarFile = { name: avatarFileInput.files[0].name, base64: avatarFileBase64 }  // Récupération du nom de l'image uploadée dans le input ainsi que de sa base64
    }

    // Initialisation de la variable "data" permettant de stocker et d'envoyer les informations (firstName, lastName, email, avatarFile & userId) au backend
    let data = {
        firstName: document.getElementById('account_input_first-name').value,
        lastName: document.getElementById('account_input_last-name').value,
        email: document.getElementById('account_input_email').value,
        avatarFile,
        userId: localStorage.getItem('userId')
    }

    fetch(`http://localhost:8080/api/users/update`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
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
            if (data.error == null) {
                let dataUpdated = data.dataUpdated // Récupération des éléments modifiés (dataUpdated) envoyés par le BackEnd

                if (data != null) { // Si la variable data n'est pas égale à null (informations de compte modifiées), réalisation de la boucle suivante

                    for (let i = 0; i < dataUpdated.length; i++) {
                        // Début - Informations de compte stockées dans le localStorage afin de les faire afficher sur le DOM
                        if (dataUpdated[i] === "firstName") {
                            localStorage.setItem("firstName", document.getElementById('account_input_first-name').value)
                        }
                        else if (dataUpdated[i] === "lastName") {
                            localStorage.setItem("lastName", document.getElementById('account_input_last-name').value)
                        }
                        else if (dataUpdated[i] === "email") {
                            localStorage.setItem("email", document.getElementById('account_input_email').value)
                        } else if (dataUpdated[i] === "avatarFile") {
                            localStorage.setItem("avatarFile", data.avatarFile)
                        }
                        // Fin - Informations de compte stockées dans le localStorage afin de les faire afficher sur le DOM
                    }
                }

            }
            // Si le backend nous renvoie l'erreur "L'adresse email est déjà prise", l'adresse email n'est pas modifiée et une alerte se crée 
            else if (data.error == "L'adresse email est déjà prise") {
                alert("L'adresse email est déjà prise")
            }

            // Si le backend nous renvoie l'erreur "Une de vos informations est invalide" (firstname ou lastname avec numéros, espaces, etc.), les informations ne sont pas modifiées et une alerte se crée 
            else if (data.error == "Une de vos informations est invalide") {
                alert("Une de vos informations est invalide")
            }
            // S'il n'y a eu aucune erreur envoyée par le backend, la page est rechargée
            document.location.href = "/mon-compte"
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Fin de la fonction "updateAccount" permettant de mettre à jour un compte utilisateur
export {
    deleteAccount,
    deconnexion,
    setImage
}

export default updateAccount
