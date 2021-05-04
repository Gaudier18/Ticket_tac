const Sequelize = require("sequelize");
const sequelize = require("../db.conf");

// Définition du model etat_ticket
module.exports = sequelize.define("etat_ticket", {
    id_etat_ticket: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    libelle_etat_ticket: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
