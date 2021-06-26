const fs = require("fs"); // Plugin "files systems" permettant de modifier ou supprimer des fichiers contenus dans le serveur (dans le dossier backend)
const models = require("../models");
const Post = models.post;
const User = models.user
const Comment = models.comment
const Like = models.like

// Début de "getAllPosts" permettant la récupération de tous les posts contenus dans la BDD
exports.getAllPosts = (req, res, next) => {
    let profileUserId = req.query.profileuserid // Attribution de "profileUserId" (userId du profil regardé) envoyé par le client à la variable "profileUserId"
    let where = {}; // Initialisation de la variable "where" au format objet (JSON)
    if (/^\d+$/.test(profileUserId)) // Si tout est conforme, alors on continu l'exécution du code
    {
        where = { authorId: profileUserId }
    }

    Post.findAll({ // Méthode ".findAll" pour effectuer une recherche d'une (ou plusieurs) ligne de la table "Post"
        where,
        include: [
            {
                model: User, as: 'author'
            },
            {
                model: Like, as: 'reactions'
            },
            {
                model: Comment, as: 'comments',
                include: [
                    {
                        model: User, as: 'author'
                    },
                    {
                        model: Like, as: 'reactions'
                    }
                ],
            }
        ],
        order: [
            ['updatedAt', 'DESC'],
            ['comments', 'id', 'DESC']
        ]
    })
        .then(posts => {
            if (posts.length > 0) {
                res.status(200).json(posts);
            }
            else {
                User.findOne({
                    where: {
                        id: profileUserId
                    }
                }).then(user => {
                    res.status(200).json(user)
                })
            }
        })
}
// Fin de "getAllPosts" permettant la récupération de tous les posts contenus dans la BDD

// Début creation d'un post
exports.createPost = async (req, res, next) => { // La méthode "exports" nous permet de récupérer uniquement l'exportation de "createPost" lorsqu'on utilisera la méthode "require" depuis un fichier externe
    let content = req.body.content
    let imageFile = req.body.imageFile
    let userId = req.body.userId

    var name = null

    if (imageFile != null) {
        var base64Data = req.body.imageFile.base64.replace(/^data:image\/[a-z]+;base64,/, ""); // Récupération de la base64 et suppression du mot-clé "images + extension" au début de la base64 afin de pouvoir l'utiliser par la suite
        name = req.body.imageFile.name.split(" ").join("_"); // Utilisation du nom d'origine & remplacement des espaces par des underscores
        var re = /(?:\.([^.]+))?$/; // Regex permettant de récupérer la chaîne de caractère après le dernier point de la chaine initiale
        var extension = re.exec(req.body.imageFile.name)[1]; // Récupération de l'extension du fichier
        var name = name.split('.' + extension)[0] // Récupération du nom du fichier (sans le point ni l'extension)
        name = name + '_' + Date.now() + '.' + extension // Ecriture du nom final : nom du fichier original (en remplaçant les espaces par des underscores) + "_" + timestamp (nombre de ms entre 1970 et l'instant actuel) + "." + extension du fichier
        await fs.writeFile("images/" + name, base64Data, 'base64', function (err) { // Fonction asynchrone. Méthode "writeFile" permettant de convertir la base64 en fichier normal et de la stocker dans le dossier "images/"
            if (err)
                console.log("err:", err);
        });
    }

    let post = {
        content,
        authorId: userId,
        imageFile: name
    }

    Post.create(post).then(post => {
        console.log(post)
        res.status(200).json({ message: "Post crée" })
    }).catch(res.status(400).json({
        error: "Erreur dans le processus de création d'un post"
    }))
};
// Fin création d'un post

// Début like d'un post
exports.likePost = (req, res, next) => {
    let userId = req.body.userId
    let postId = req.body.postId
    let reaction = req.body.likeDislike // Si likeDislike est égal à 1, l'utilisateur a appuyé sur le bouton de like. Si c'est égal à 0, l'utilisateur a appuyé sur le bouton de dislike.
    let likedDisliked = req.body.likedDisliked // likedDisliked est égal à 1, le like ou le dislike était déjà activé. Il faudra alors retirer le like ou le dislike.

    Like.destroy({
        where: {
            authorId: userId,
            postId,
            commentId: null
        }
    })

    if (likedDisliked == 1) {
        const newReaction = {
            authorId: userId,
            postId,
            reaction
        }
        Like.create(newReaction)
    }
};
// Fin like d'un post

// Début suppression d'un post
exports.removePost = (req, res, next) => {
    let userId = req.body.userId
    let postId = req.body.postId

    let isAdmin = 0
    User.findOne({
        where: {
            id: userId
        }
    }).then(user => {
        isAdmin = user.isAdmin
        if (isAdmin) {
            Post.destroy({
                where: {
                    id: postId
                }
            }).then((post) => {
                if (fs.existsSync('images/' + post.imageFile)) { // Si le fichier existe, réalisation de la ligne suivante
                    fs.unlink('images/' + post.imageFile)
                }
            })
            Comment.destroy({
                where: {
                    postId
                }
            })
            res.status(200).json({ message: 'Post supprimée' })
        } else {
            Post.findOne({
                where: {
                    id: postId,
                    authorId: userId
                }
            }).then(post => {
                post.destroy()
                if (fs.existsSync('images/' + post.imageFile)) { // Si le fichier existe, réalisation de la ligne suivante
                    fs.unlink('images/' + post.imageFile)
                }
                res.status(200).json({ message: 'Post supprimée' })
                Comment.destroy({
                    where: {
                        postId
                    }
                })
            }).catch(res.status(400).json({ error: "Erreur dans le processus de suppression du post" }))
        }
    })

}
// Fin suppression d'un post