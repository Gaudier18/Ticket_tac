/* 

Fichier : utilisateur.js
Description : Contient les routes de l'API pour toute action lié à un utilisateur

*/

// Importation des modules
const express = require('express');
const db = require("../database/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcryptConf = require("../config/bcrypt.conf");
const sequelize = require("../database/db.conf");
const jwtConf = require("../config/jwt.conf");

// Récupération de tous les utilisateurs
router.get("/", (req, res) => {
    db.utilisateur.findAll({
        subQuery: false,
        order: [['id_utilisateur', 'ASC']],
        include: [{
            model: db.type_utilisateur,
            as: 'type_utilisateur'
        }, {
            model: db.mot_de_passe,
            as: 'mot_de_passe'
        }],
        attributes: { exclude: ['fk_mot_de_passe', 'fk_type_utilisateur'] }
    })
    .then(utilisateurs => {
        res.status(200).json(utilisateurs);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Suppression d'un utilisateur basé sur son id
router.delete("/:id", (req, res) => {
    sequelize.query(`DELETE FROM utilisateur WHERE id_utilisateur = ` + req.params.id + ` RETURNING id_utilisateur`
    , {
        // Affecte juste le format des données retournées, ici on retourne quelque chose donc on laisse QueryTypes.SELECT
        type: sequelize.QueryTypes.SELECT
    })
    .then(utilisateur => {
        if (utilisateur) {
            res.status(200).json("L'utilisateur " + utilisateur[0].identifiant_utilisateur + " a été supprimé")
        }
        else {
            res.status(404).json();
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Modification d'un utilisateur basé sur son id
router.put("/:id", (req, res) => {
    db.utilisateur.findOne({
        where: {
            id_utilisateur: req.params.id,
        },
        include: [{
            model: db.mot_de_passe,
            as: 'mot_de_passe'
        }],
        attributes: { exclude: ['fk_mot_de_passe'] }
    })
    .then((utilisateur) => {
        if (utilisateur) {
            db.type_utilisateur.findOne({
                where : {
                    libelle_type_utilisateur: req.body.libelle_type_utilisateur
                }
            })
            .then(type_utilisateur => {
                if (req.body.mot_de_passe != null) {
                    utilisateur.update({
                        identifiant_utilisateur: req.body.identifiant_utilisateur,
                        fk_type_utilisateur: type_utilisateur.get("id_type_utilisateur")
                    });
                    utilisateur.mot_de_passe.update({
                        libelle_mot_de_passe: bcrypt.hashSync(req.body.mot_de_passe, bcryptConf.saltRounds)
                    });
                    res.status(200).json(utilisateur);
                }
                else {
                    utilisateur.update({
                        identifiant_utilisateur: req.body.identifiant_utilisateur,
                        fk_type_utilisateur: type_utilisateur.get("id_type_utilisateur")
                    });
                    res.status(200).json(utilisateur);
                }  
            })
            .catch(err => {
                res.status(500).json(err);
            });
        }
        else {
            res.status(404).json();
        }
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

// Création d'un utilisateur
router.post("/creation", (req, res) => {
    db.type_utilisateur.findOne({
        where : {
            libelle_type_utilisateur: req.body.libelle_type_utilisateur
        }
    })
    .then(type_utilisateur => {
        db.utilisateur.create({
            identifiant_utilisateur: req.body.identifiant_utilisateur,
            fk_type_utilisateur: type_utilisateur.get("id_type_utilisateur"),
            mot_de_passe: [{
                libelle_mot_de_passe: bcrypt.hashSync(req.body.mot_de_passe, bcryptConf.saltRounds)
            }]
        }, 
        {
            include: [{
                model: db.mot_de_passe,
                as: 'mot_de_passe'
            }]
        })
        .then((utilisateur) => {
            res.status(200).json(utilisateur);
        })
        .catch(err => {
            res.status(421).json(err);
        }); 
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Connexion d'un utilisateur (vérification de la correspondance identifiant / mot de passe)
router.post("/connexion", (req, res) => {
    db.utilisateur.findOne({
        subQuery: false,
        where: {
            identifiant_utilisateur: req.body.identifiant_utilisateur
        },
        include: [{
            model: db.mot_de_passe,
            as: 'mot_de_passe',
        },
        {
            model: db.type_utilisateur,
            as: 'type_utilisateur'
        }],
        exclude: ["mot_de_passe"],
        attributes: { exclude: ['fk_mot_de_passe', 'fk_type_utilisateur'] }
    })
    .then((utilisateur) => {
        if (verif_mot_de_passe = bcrypt.compareSync(req.body.mot_de_passe, utilisateur.mot_de_passe.libelle_mot_de_passe)) {
            var token = jwt.sign(
                {
                    id_utilisateur: utilisateur.id_utilisateur,
                    identifiant_utilisateur: utilisateur.identifiant_utilisateur
                },
                jwtConf.secret,
                {
                    expiresIn: jwtConf.expiresIn
                }
            );
            res.json({
                utilisateur: utilisateur,
                token: token
            });
        }
        else {
            res.status(403).json();
        }
    })
    .catch(err => {
        res.status(421).json(err);
    });
})

module.exports = router;
