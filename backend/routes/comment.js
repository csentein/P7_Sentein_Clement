// Les routes ne contiennent que la logique de routing (nous importons la logique métier depuis les fichiers controllers)

const express = require("express"); // Importation du framework Express (permettant de simplifier la configuration d'un serveur avec NodeJS)
const router = express.Router(); // Initialisation du router Express (permettant de faire démarrer le serveur sur Comment.js)

const commentCtrl = require("../controllers/comment"); // Importation du controller "comment.js"

const auth = require("../middlewares/auth"); // Importation du système d'authentification à l'aide des tokens 

// Importation des routes du controlleur "comment"
router.post("/createcomment", auth, commentCtrl.createComment);
router.post("/likecomment", auth, commentCtrl.likeComment);
router.delete("/removecomment", auth, commentCtrl.removeComment);

module.exports = router;