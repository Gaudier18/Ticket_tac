const Sequelize = require("sequelize");
const sequelize = require("../db.conf");

// Définition du model mot_de_passe
module.exports = sequelize.define("mot_de_passe", {
    id_mot_de_passe: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    libelle_mot_de_passe: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
