/*

Fichier : index.js
Commande : node index.js
Description : Script à executer pour lancer l'API, celui-ci initialise l'application en respectant les configurations stipulées

*/

// Déclaration des constantes de l'API
const http = require('http');
const express = require('express');
const expressJwt = require("express-jwt");
const db = require("./database/index");
const jwtConf = require("./config/jwt.conf");
const cors = require('cors');
// Initialisation de l'application et autorisation du CORS
const app = express();
app.use(cors());

// Initialisation du model de la base de donnée (sequelize)
db.Init();

// Définition des headers par défaut
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Encodage des URL et définition du format des réponses
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Sécurisation des routes
app.use(
  expressJwt({
    secret: jwtConf.secret,
    algorithms: jwtConf.algorithms
  })
  .unless({
    path: ["/utilisateur/connexion"]
  })
)

// Normalisation du port du serveur
const normalisation_port = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Définition du port
const port = normalisation_port(process.env.PORT || '3000');
app.set('port', port);

// Gestion des erreurs
const gestion_erreur = erreur => { 
  if (erreur.syscall !== 'listen') {
    throw erreur;
  }
  const adresse = serveur.address();
  const lien = typeof adresse === 'string' ? 'pipe ' + adresse : 'port: ' + port;
  switch (erreur.code) {
    case 'EACCES':
      console.error(lien + " necessite les droits d'administrateur.");
      process.exit(1);
    case 'EADDRINUSE':
      console.error(lien + " est déjà en cours d'utilisation.");
      process.exit(1);
    default:
      throw erreur;
  }
};

// Création du serveur
const serveur = http.createServer(app);

// Gestion des événements
serveur.on('error', gestion_erreur);
serveur.on('listening', () => {
  const adresse = serveur.address();
  const lien = typeof adresse === 'string' ? 'pipe ' + adresse : 'port ' + port;
  console.log('Écoute sur le port : ' + lien);
});

// Écoute sur le port (3000)
serveur.listen(port);

// Déclaration des routes
app.use("/utilisateur", require("./routes/utilisateur"));
app.use("/type_utilisateur", require("./routes/type_utilisateur"));
app.use("/ticket", require("./routes/ticket"));
app.use("/etat_ticket", require("./routes/etat_ticket"));
app.use("/materiel", require("./routes/materiel"));
