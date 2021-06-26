const passwordValidator = require('password-validator'); // Plugin permettant de demander un format de mot de passe unique (min 6 caractères, max 30 caractères, etc.)
const validator = require("validator"); // Importation du plugin "validator" permettant de vérifier si les chaînes de caractères respectent le format attendu
const schema = new passwordValidator();

schema // Critères pour le MDP
    .has().uppercase()                              // Doit contenir des majuscules
    .has().lowercase()                              // Doit contenir des minuscules
    .is().min(6)                                    // Longueur minimale : 6
    .is().max(30)                                   // Longueur maximale : 30
    .has().digits()                                 // Doit contenir des numéros
    .has().not().spaces()                           // Ne doit pas contenir d'espaces

module.exports = (req, res, next) => {
    let regex = /[A-zÀ-ú\s]/; // Regex permettant de détecter les caractères spéciaux, les espaces et les chiffres
    let isFirstName = validator.matches(String(req.body.firstName), regex); // Récupération du firstName envoyé par le frontEnd et attribution à la variable "isFirstName" (vérification de la conformité à l'aide de la regex)
    let isLastName = validator.matches(String(req.body.lastName), regex);
    let isEmail = validator.isEmail(String(req.body.email)); // "validator.isEmail" permet de vérifier si "req.body.email" est bien au format email (càd : un @, un point et pas de caractères spéciaux/maj)

    if (schema.validate(req.body.password) && isFirstName && isLastName && isEmail) { // Si le schéma du mot de passe est valide, exécution du code suivant
        next()
    } else {
        res.status(400).json({ error: "L'un des champ ne respecte pas le format attendu" });
    }
}
