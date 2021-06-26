// Création de la table "like" pour les likes sous les posts/commentaires
module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("like", {
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
            allowNull: true,
            references: {
                model: 'posts',
                key: 'id'
            }
        },
        commentId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'comments',
                key: 'id'
            }
        },
        reaction: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }
    });
    Like.associate = function (models) {
        Like.belongsTo(models.user, { foreignKey: 'authorId', hooks: true, as: 'author' })
        Like.belongsTo(models.post, { foreignKey: { name: 'postId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'reactionsPost' })
        Like.belongsTo(models.comment, { foreignKey: { name: 'commentId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'reactionsComment' })
    };
    return Like;
};