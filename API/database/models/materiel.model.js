const Sequelize = require("sequelize");
const sequelize = require("../db.conf");

// Définition du model materiel
module.exports = sequelize.define("materiel", {
    id_materiel: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    type_materiel: {
        type: Sequelize.STRING,
        allowNull: false
    }
});
