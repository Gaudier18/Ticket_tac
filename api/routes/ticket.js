/* 

Fichier : ticket.js
Description : Contient les routes de l'API pour toute action lié à un ticket

*/

// Importation des modules
const express = require('express');
const db = require("../database/index");
const sequelize = require("../database/db.conf");
const router = express.Router();

// Récupération des tickets
router.get("/", (req, res) => {
    sequelize.query(`SELECT
                    t.id_ticket
                    ,t.description_ticket
                    ,t.date_resolution_ticket
                    ,t.fk_etat_ticket
                    ,t.fk_crea_utilisateur
                    ,t.fk_modif_utilisateur
                    ,t.date_saisie_ticket
                    ,et.libelle_etat_ticket
                    ,u_crea.identifiant_utilisateur AS identifiant_crea_utilisateur
                    ,u_modif.identifiant_utilisateur AS identifiant_modif_utilisateur
                    FROM ticket t
                    INNER JOIN etat_ticket et ON et.id_etat_ticket = t.fk_etat_ticket
                    INNER JOIN utilisateur u_crea ON u_crea.id_utilisateur = t.fk_crea_utilisateur
                    LEFT JOIN utilisateur u_modif ON u_modif.id_utilisateur = t.fk_modif_utilisateur
                    ORDER BY t.id_ticket`
        , {
            type: sequelize.QueryTypes.SELECT
        })
        .then(tickets => {
            if(tickets.length > 0) {
                for (let i = 0; i < tickets.length; i++) {
                    sequelize.query(`SELECT 
                                    m.id_materiel,
                                    m.type_materiel 
                                    FROM materiel m 
                                    INNER JOIN ticket_materiel tm ON tm.fk_materiel = m.id_materiel 
                                    WHERE tm.fk_ticket = ` + tickets[i].id_ticket
                        , {
                            type: sequelize.QueryTypes.SELECT
                        })
                        .then(materiels_ticket => {
                            Object.assign(tickets[i], { materiels: materiels_ticket })
                            if (i === tickets.length - 1) {
                                res.status(200).json(tickets);
                            }
                        })
                        .catch(err => {
                            res.status(404).json(err);
                        });
                }
            }
            else {
                res.status(200).json("Aucun ticket");
            }
        })
        .catch(err => {
            res.status(404).json(err);
        });
});

// Suppression d'un ticket basé sur ton id
router.delete("/:id", (req, res) => {
    sequelize.query(`DELETE FROM ticket WHERE id_ticket = ` + req.params.id + ` RETURNING id_ticket`
        , {
            // Affecte juste le format des données retournées, ici on retourne quelque chose donc on laisse QueryTypes.SELECT
            type: sequelize.QueryTypes.SELECT
        })
        .then(ticket => {
            if (ticket) {
                res.status(200).json("Le ticket N°" + ticket[0].id_ticket + " a été supprimé")
            }
            else {
                res.status(404).json();
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Modification d'un ticket basé sur id
router.put("/:id", (req, res) => {
    db.etat_ticket.findOne({
        where : {
            libelle_etat_ticket: req.body.libelle_etat_ticket
        }
    })
    .then(etat_ticket => {
        if (req.body.ticket_resolu) {
            sequelize.query(`SELECT * 
            FROM func_modif_ticket(
            CAST (` + req.body.id_utilisateur + ` AS INTEGER)
            , CAST (` + req.params.id + ` AS INTEGER)
            , CAST (` + etat_ticket.get("id_etat_ticket") + ` AS INTEGER)
            , CAST('` + req.body.description_ticket + `' AS TEXT)
            , CAST(ARRAY [` + req.body.array_materiel + `] AS INTEGER[])
            , CAST(NOW() AS TIMESTAMP WITH TIME ZONE));`
                , {
                    type: sequelize.QueryTypes.SELECT
                })
                .then(ticket => {
                    res.status(200).json(ticket);
                })
                .catch(err => {
                    res.status(404).json(err);
                });
        }
        else {
            sequelize.query(`SELECT * 
            FROM func_modif_ticket(
            CAST (` + req.body.id_utilisateur + ` AS INTEGER)
            , CAST (` + req.params.id + ` AS INTEGER)
            , CAST (` + etat_ticket.get("id_etat_ticket") + ` AS INTEGER)
            , CAST('` + req.body.description_ticket + `' AS TEXT)
            , CAST(ARRAY [` + req.body.array_materiel + `] AS INTEGER[]));`
                , {
                    type: sequelize.QueryTypes.SELECT
                })
                .then(ticket => {
                    res.status(200).json(ticket);
                })
                .catch(err => {
                    res.status(404).json(err);
                });
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// Ajout d'un ticket
router.post("/", (req, res) => {
    sequelize.query(`SELECT * 
        FROM func_crea_ticket(
        CAST (` + req.body.id_utilisateur + ` AS INTEGER)
        , CAST('` + req.body.description_ticket + `' AS TEXT)
        , CAST(ARRAY [` + req.body.array_materiel + `] AS INTEGER[]));`
        , {
            type: sequelize.QueryTypes.SELECT
        })
        .then(ticket => {
            res.status(200).json(ticket);
        })
        .catch(err => {
            res.status(404).json(err);
        });
});

module.exports = router;
