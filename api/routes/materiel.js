/* 

Fichier : materiel.js
Description : Contient les routes de l'API pour toute action lié à un materiel

*/

// Importation des modules
const express = require('express');
const db = require("../database/index");
const router = express.Router();

// Récupérations des materiels
router.get("/", (req, res) => {
    db.materiel.findAll()
    .then(materiels => {
        res.status(200).json(materiels);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;
