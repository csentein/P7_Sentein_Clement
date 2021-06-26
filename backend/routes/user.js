// Les routes ne contiennent que la logique de routing (nous importons la logique métier depuis les fichiers controllers)

const express = require('express'); // Importation du framework Express (permettant de simplifier la configuration d'un serveur avec NodeJS)
const router = express.Router(); // Initialisation du router Express (permettant de faire démarrer le serveur sur User.js)
const userCtrl = require('../controllers/user'); // Importation du controller "user.js"
const expressBouncer = require("express-bouncer")(5000, 600000, 3); // Le plugin "express-bouncer" permet d'atténuer les attaques par force brute (attaque par force brute = consiste à tester une multitude de mots de passes chaque seconde)

const auth = require("../middlewares/auth"); // Importation du système d'authentification à l'aide des tokens 
const signinValidator = require('../middlewares/signinValidator');
const signupValidator = require('../middlewares/signupValidator');

// Importation des routes du controlleur "user"
router.post('/signup', signupValidator, userCtrl.signup); // Ce sont des routes "post" car le frontend envoie des informations (l'adresse email et le mdp)
router.post('/login', signinValidator, expressBouncer.block, userCtrl.login);
router.delete('/remove', auth, userCtrl.remove); // Nécessite une authentification (token valide) pour pouvoir effectuer l'action "userCtrl.remove"
router.put('/update', auth, signinValidator, userCtrl.update); // Nécessite une authentification (token valide) pour pouvoir effectuer l'action "userCtrl.update"

module.exports = router;