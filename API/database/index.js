/* 

Fichier : index.js
Description : Création des relations entre les models et définition de la fonction de synchronisation des données

*/

// Import de sequelize et des différents models
const sequelize = require("./db.conf");
const ticket = require('./models/ticket.model.js');
const etat_ticket = require('./models/etat_ticket.model.js');
const utilisateur = require('./models/utilisateur.model.js');
const type_utilisateur = require('./models/type_utilisateur.model.js');
const materiel = require('./models/materiel.model.js');
const mot_de_passe = require('./models/mot_de_passe.model.js');

// Synchronisation des données avec les models
const Init = () => {
  sequelize.sync({ alter: true })
  .then(() => {
    console.log("Base de données synchronisée !")
  });
};

// Définition des relations entre les models
ticket.belongsTo(etat_ticket, { foreignKey: 'fk_etat_ticket', as : 'etat_ticket' });
ticket.belongsTo(utilisateur, { foreignKey: 'fk_crea_utilisateur', as: 'createur' });
ticket.belongsTo(utilisateur, { foreignKey: { name: 'fk_modif_utilisateur', allowNull: true } , as: 'modifieur' });

materiel.belongsToMany(ticket, { through: 'ticket_materiel', foreignKey: 'fk_materiel', otherKey: 'fk_ticket' });

utilisateur.belongsTo(type_utilisateur, { foreignKey: 'fk_type_utilisateur', onDelete: 'cascade', as: 'type_utilisateur' });
utilisateur.belongsTo(mot_de_passe, { foreignKey: 'fk_mot_de_passe', onDelete: 'cascade', as: 'mot_de_passe' });

// Export des modules
module.exports = {
  Init: Init,
  ticket: ticket,
  etat_ticket: etat_ticket,
  utilisateur: utilisateur,
  mot_de_passe: mot_de_passe,
  materiel: materiel,
  type_utilisateur: type_utilisateur
};
