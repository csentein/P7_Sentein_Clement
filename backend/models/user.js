// Création de la table "user" pour les comptes utilisateur stockés dans la BDD
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        avatarFile: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'defaultavatar.png'
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
    });
    User.associate = function (models) {
        User.hasMany(models.post, { foreignKey: { name: 'authorId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'publications' }),
            User.hasMany(models.like, { foreignKey: { name: 'authorId' }, onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true, as: 'reactions', constraints: false })
    };
    return User;
};