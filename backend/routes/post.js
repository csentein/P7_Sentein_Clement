// Les routes ne contiennent que la logique de routing (nous importons la logique métier depuis les fichiers controllers)

const express = require("express"); // Importation du framework Express (permettant de simplifier la configuration d'un serveur avec NodeJS)
const router = express.Router(); // Initialisation du router Express (permettant de faire démarrer le serveur sur Post.js)

const postCtrl = require("../controllers/post"); // Importation du controller "post.js"

const auth = require("../middlewares/auth"); // Importation du système d'authentification à l'aide des tokens 

// Importation des routes du controlleur "post"
router.get("/", auth, postCtrl.getAllPosts);
router.post("/createpost", auth, postCtrl.createPost);
router.post("/likepost", auth, postCtrl.likePost);
router.delete("/removepost", auth, postCtrl.removePost)

module.exports = router;