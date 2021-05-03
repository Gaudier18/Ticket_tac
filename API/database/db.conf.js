/*

Fichier : db.conf.js
Description : Configuration de la connexion à la base de données

*/

// Importation de sequelize
const Sequelize  = require('sequelize');
const dotenv = require("dotenv");
dotenv.config();

const BDD = process.env.BDD == undefined ? "ticket_tac" : process.env.BDD;
const BDD_URL = process.env.BDD_URL == undefined ? "127.0.0.1" : process.env.BDD_URL;
const UTILISATEUR = process.env.UTILISATEUR == undefined ? "postgres" : process.env.UTILISATEUR;
const MOT_DE_PASSE = process.env.MOT_DE_PASSE == undefined ? "postgres" : process.env.MOT_DE_PASSE;

// Connexion à la base de données et définition des propriétés par défaut pour les models
const sequelize = new Sequelize(BDD, UTILISATEUR, MOT_DE_PASSE,{
    host: BDD_URL,
	port:5432,
    dialect: 'postgres',
    define: {
        timestamps: false,
        freezeTableName: true,
        underscored: true
    }
});

module.exports = sequelize;
