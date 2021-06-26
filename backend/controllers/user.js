const models = require("../models");
const User = models.user;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');

// Début création de compte
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = {
                email: req.body.email,
                password: hash,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                avatarFile: req.body.avatarFile
            };
            User.create(newUser)
                .then(user => {
                    console.log('user : ', user)

                    res.status(201).json({ // (Code 201 : création de ressource) Création des données envoyées dans l'appel AJAX (message, userId, token, etc.)
                        message: "L'utilisateur a bien été créé.",
                        userId: user.id,
                        token: jwt.sign( // Création du token avec 2 payloads : userId & account ainsi que la clé secrète et l'expiration du token et envoi au frontend
                            {
                                userId: user.id,
                                isAdmin: 0,
                            },
                            process.env.JWT_SECRET, // Clé secrète contenue dans le fichier ".env"
                            {
                                expiresIn: process.env.JWT_EXPIRES,
                            }
                        )
                    });
                })
                .catch(err => {
                    res.status(400).json({
                        error: "L'utilisateur existe déjà !" // En cas d'erreur, le backend indique au frontend que l'utilisateur existe déjà (adresse email déjà prise)
                    })
                })
        })
        .catch(err => {

            res.status(500).json({ message: 'Erreur lors du processus de création de compte' })
        });
}
// Fin création de compte

// Début fonction permettant la connexion
exports.login = function (req, res) {
    if (!req.body.email || !req.body.password) {
        res.status(404).json({ message: "L'email et le mot de passe sont nécessaires" });
    } else {
        const email = req.body.email;
        const password = req.body.password;
        const userFound = { where: { email } };

        User.findOne(userFound)
            .then(user => {
                console.log(user)
                if (!user) {
                    res.status(404).json({ message: 'Echec de l\'authentification!' });
                } else {
                    bcrypt.compare(password, user.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(401).json({ message: 'Mot de passe incorrect' });
                            }

                            res.status(200).json({
                                userId: user['dataValues'].id, // Envoi de l'userId au FrontEnd
                                isAdmin: user['dataValues'].isAdmin, // Envoi du type de compte au FrontEnd
                                token: jwt.sign( // Envoi du token unique et crypté au FrontEnd
                                    {
                                        userId: user['dataValues'].id,
                                        account: user['dataValues'].isAdmin,
                                    },
                                    process.env.JWT_SECRET,
                                    {
                                        expiresIn: process.env.JWT_EXPIRES,
                                    }
                                ),
                                firstName: user['dataValues'].firstName, // Envoi du firstName, du lastName, de l'avatarFile et de l'email au FrontEnd
                                lastName: user['dataValues'].lastName,
                                avatarFile: user['dataValues'].avatarFile,
                                email: user['dataValues'].email
                            });
                        })
                        .catch(err => {
                            res.status(500).json({ error: err })
                        });
                }
            })
            .catch(err => {
                res.status(500).json({ error: err })
            });
    }
}
// Fin fonction permettant la connexion

// Début fonction permettant la suppression du compte
exports.remove = (req, res, next) => {
    const id = req.body.userId;
    // On cherche d'abord l'utilisateur pour récupérer le nom du fichier image à supprimer
    User.findOne({ where: { id: id } })
        .then(user => {
            const avatarFile = user.avatarFile
            if (avatarFile != 'defaultavatar.png') {
                fs.unlink(`../images/${avatarFile}`)
            }
            user.destroy()
                .then(num => {
                    if (num == 1) {
                        res.status(200).json({ message: "L'utilisateur a bien été supprimé" });
                    } else {
                        res.send({ message: `L'utilisateur n'a pas pu être supprimé` });
                    }
                })
                .catch(err => {
                    res.status(500).send({ message: "L'utilisateur n'a pas pu être supprimé" });
                });
        })
        .catch(err => {
            res.status(500).send({ message: "Utilisateur introuvable. Id : " + id });
        });

}
// Fin fonction permettant la suppression du compte

// Début fonction permettant la modification du compte
exports.update = async (req, res, next) => {
    let dataUpdated = [] // Initialisation de la variable "dataUpdated" en Array
    var name = "" // Initialisation de la variable "name" au format string
    let userId = req.body.userId
    let updatedValues = {}
    if (req.body.avatarFile.name != null) { // Si le compte possédait un avatar, l'exécution du code continue
        var base64Data = req.body.avatarFile.base64.replace(/^data:image\/[a-z]+;base64,/, ""); // Suppression du début de la base64 de l'image (cela cause des problèmes pour convertir la base64 en image)
        name = req.body.avatarFile.name.split(" ").join("_"); // Utilisation du nom d'origine & remplacement des espaces par des underscores
        var re = /(?:\.([^.]+))?$/; // Regex permettant de récupérer la chaîne de caractère après le dernier point de la chaine initiale
        var extension = re.exec(req.body.avatarFile.name)[1]; // Récupération de l'extension du fichier
        var name = name.split('.' + extension)[0] // Récupération du nom du fichier (sans le point ni l'extension)
        name = name + '_' + Date.now() + '.' + extension // Ecriture du nom final : nom du fichier original (en remplaçant les espaces par des underscores) + "_" + timestamp (nombre de ms entre 1970 et l'instant actuel) + "." + extension du fichier

        await fs.writeFile("images/" + name, base64Data, 'base64', function (err) { // Fonction asynchrone. Méthode "writeFile" permettant de convertir la base64 en fichier normal et de la stocker dans le dossier "images/"
            if (err) {
                console.log("err : ", err);
            }
        });
        updatedValues['avatarFile'] = name
        dataUpdated.push("avatarFile")
    }

    if (req.body.firstName != null && /[A-zÀ-ú]/.test(req.body.firstName)) {
        dataUpdated.push('firstName')
        updatedValues['firstName'] = req.body.firstName
    }
    if (req.body.lastName != null && /[A-zÀ-ú]/.test(req.body.lastName)) {
        dataUpdated.push('lastName')
        updatedValues['lastName'] = req.body.lastName
    }
    if (req.body.email != null && /[A-zÀ-ú]/.test(req.body.email)) {
        dataUpdated.push('email')
        updatedValues['email'] = req.body.email
    }

    User.findOne({ where: { id: userId } })
        .then((user) => {
            const avatarFile = user.avatarFile
            if (user.id == userId) {
                if (avatarFile != 'defaultavatar.png' && dataUpdated.avatarFile != null) {
                    fs.unlink(`images/${avatarFile}`, (err) => { // La méthode "fs.unlink" permet de supprimer un fichier (image) du dossier "images"
                        if (err)
                            console.log('err : ', err)
                    })
                }
                user.update(updatedValues)
                    .then(updatedRows => {
                        res.status(200).json({ // Envoi au frontend du message, des données mises à jour et du nom de l'avatar
                            message: "L'utilisateur a été mis à jour !",
                            dataUpdated,
                            avatarFile: updatedValues['avatarFile']
                        })
                    })
                    .catch(function () {
                        res.status(500).json({ // Si une erreur est survenue, envoi d'un message d'erreur
                            error: "Erreur lors de la modification du profil"
                        })
                    });
            }
        })
}
// Fin fonction permettant la modification du compte