/* 

Fichier : type_utilisateur.js
Description : Contient les routes de l'API pour toute action lié à un type d'utilisateur

*/

// Importation des modules
const express = require('express');
const db = require("../database/index");
const router = express.Router();

// Récupération des types d'utilisateur
router.get("/", (req, res) => {
    db.type_utilisateur.findAll()
    .then(types_utilisateur => {
        res.status(200).json(types_utilisateur);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;
