/* 

Fichier : etat_ticket.js
Description : Contient les routes de l'API pour toute action lié à un etat_ticket

*/

// Importation des modules
const express = require('express');
const db = require("../database/index");
const router = express.Router();

// Récupération des etats ticket
router.get("/", (req, res) => {
    db.etat_ticket.findAll()
    .then(etats_ticket => {
        res.status(200).json(etats_ticket);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;
