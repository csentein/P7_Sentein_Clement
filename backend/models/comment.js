// Création de la table "comment" pour les commentaires sous les posts
module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("comment", {
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        postId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
    });
    Comment.associate = function (models) {
        Comment.belongsTo(models.user, { foreignKey: 'authorId', hooks: true, as: 'author' })
        Comment.hasMany(models.like, { foreignKey: { name: 'commentId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'reactions' })
    };
    return Comment;
};