const Sequelize = require("sequelize");
const sequelize = require("../db.conf");

// Définition du model utilisateur
module.exports = sequelize.define("utilisateur", {
    id_utilisateur: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    identifiant_utilisateur: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
