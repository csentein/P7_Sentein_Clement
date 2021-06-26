const models = require("../models");
const Comment = models.comment;
const Like = models.like;
const User = models.user;

// Début de la fonction "likeComment"
exports.likeComment = (req, res, next) => {
    let userId = req.body.userId
    let commentId = req.body.commentId
    let reaction = req.body.likeDislike // Si likeDislike est égal à 1, l'utilisateur a appuyé sur le bouton de like. Si c'est égal à 0, l'utilisateur a appuyé sur le bouton de dislike.
    let likedDisliked = req.body.likedDisliked // likedDisliked est égal à 1, le like ou le dislike était déjà activé. Il faudra alors retirer le like ou le dislike.

    Like.destroy({ // Méthode ".destroy" pour effectuer une suppression d'une (ou plusieurs) ligne de la table "Like"
        where: {
            authorId: userId,
            commentId,
            postId: null
        }
    })

    if (likedDisliked == 1) {
        const newReaction = {
            authorId: userId,
            commentId,
            reaction
        }
        Like.create(newReaction) // Méthode ".create" pour effectuer une création d'une (ou plusieurs) ligne de la table "Like"
    }
}
// Fin de la fonction "likeComment"

// Début creation d'un commentaire (et enregistrement dans la BDD)
exports.createComment = (req, res, next) => { // La méthode "exports" nous permet de récupérer uniquement l'exportation de "commentPost" lorsqu'on utilisera la méthode "require" depuis un fichier externe
    const newComment = {
        content: req.body.content,
        postId: req.body.postId,
        authorId: req.body.userId
    };

    Comment.create(newComment).then(comment => {
        console.log(comment)
        res.status(201).json({
            message: 'Commentaire crée'
        }).catch(res.status(400).json({
            error: 'Erreur dans la création du commentaire'
        }))
    })
}
// Fin création d'un commentaire (et enregistrement dans la BDD)

// Début suppression d'un commentaire
exports.removeComment = (req, res, next) => { // La méthode "exports" nous permet de récupérer uniquement l'exportation de "commentPost" lorsqu'on utilisera la méthode "require" depuis un fichier externe
    let userId = req.body.userId
    let commentId = req.body.commentId

    let isAdmin = 0
    User.findOne({
        where: {
            id: userId
        }
    }).then(user => {
        isAdmin = user.isAdmin
        if (isAdmin) {
            Comment.destroy({
                where: {
                    id: commentId
                }
            })
            res.status(200).json({ message: 'Commentaire supprimée' })
        } else {
            Comment.findOne({ // Méthode ".findOne" pour effectuer une sélection d'une ou plusieurs lignes de la table "Comment"
                where: {
                    id: commentId,
                    authorId: userId
                }
            }).then(comment => {
                comment.destroy()
                res.status(200).json({ message: 'Commentaire supprimée' })
            }).catch(res.status(400).json({ error: "Erreur dans le processus de suppression du commentaire" }))
        }
    })
}
// Fin suppression d'un commentaire