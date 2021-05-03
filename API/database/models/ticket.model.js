const Sequelize = require("sequelize");
const sequelize = require("../db.conf");

// Définition du model ticket
module.exports = sequelize.define("ticket", {
    id_ticket: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    date_resolution_ticket: {
        type: Sequelize.DATE,
        allowNull: true
    },
    description_ticket: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    date_saisie_ticket: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
    }
});
