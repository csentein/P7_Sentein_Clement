// Création de la table "post" pour les posts de la page d'accueil
module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
        authorId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        imageFile: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });
    Post.associate = function (models) {
        Post.belongsTo(models.user, { foreignKey: 'authorId', hooks: true, as: 'author' })
        Post.hasMany(models.like, { foreignKey: { name: 'postId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'reactions' })
        Post.hasMany(models.comment, { foreignKey: { name: 'postId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'comments' })
    };
    return Post;
};