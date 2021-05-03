const Sequelize = require("sequelize");
const sequelize = require("../db.conf");

// Définition du model type_utilisateur
module.exports = sequelize.define("type_utilisateur", {
    id_type_utilisateur: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    libelle_type_utilisateur: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
