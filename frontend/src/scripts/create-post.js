
// Début de la fonction "encodeImageFileAsURL" permettant de convertir une image en Base64
function encodeImageFileAsURL(element) {
    return new Promise((resolve) => {
        var file = element.files[0];
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
    })
}
// fin de la fonction "encodeImageFileAsURL" permettant de convertir une image en Base64

// Début de la fonction asynchrone "uploadPost" permettant d'envoyer le contenu du post, l'userId ainsi qu'éventuellement l'image en base64 et le nom de l'image
async function uploadPost() {
    var createpostInputImageFile = document.getElementById('createpost_input_image-file')
    let data = {
        content: document.getElementById('createpost_textarea').value,
        userId: localStorage.getItem('userId')
    }

    // Initialisation de la variable "createpostInputImageFileBase64"
    let createpostInputImageFileBase64

    // Si "createpostInputImageFile" est existant (> à 0), on encode l'image en base64 et on la stock dans la variable "createpostInputImageFileBase64"
    if (createpostInputImageFile.value.length > 0) {
        createpostInputImageFileBase64 = await encodeImageFileAsURL(createpostInputImageFile)

        // Initialisation de la variable "data" contenant le contenu, l'userId et l'image à envoyer à la requête AJAX
        data = {
            content: document.getElementById('createpost_textarea').value,
            userId: localStorage.getItem('userId'),
            imageFile: { name: createpostInputImageFile.files[0].name, base64: createpostInputImageFileBase64 }
        }
    }

    fetch(`http://localhost:8080/api/posts/createpost`, {
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
            document.location.href = "/" // Une fois la requête effectué, rechargement de la page pour faire apparaître le post
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
// Fin de la fonction asynchrone "uploadPost" permettant d'envoyer le contenu du post, l'userId ainsi qu'éventuellement l'image en base64 et le nom de l'image

export default uploadPost