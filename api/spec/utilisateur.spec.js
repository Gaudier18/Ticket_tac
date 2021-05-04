var entete = require("./entete");
var dotenv = require("dotenv");
const axios = require('axios');
dotenv.config();
var token;

const url_base = process.env.API_URL == undefined ? "http://localhost" : process.env.API_URL;
const port = process.env.PORT == undefined ? "3000" : process.env.PORT;

function generer_chaine_aletoire(taille) {
  var resultat = [];
  var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < taille; i++) {
    resultat.push(caracteres.charAt(Math.floor(Math.random() * caracteres.length)));
  }
  return resultat.join('');
}

// requête pour créer un compte, à changer à chaque fois
let objet_utilisateur = {
  "identifiant_utilisateur": generer_chaine_aletoire(10),
  "mot_de_passe": generer_chaine_aletoire(20),
  "libelle_type_utilisateur": "Intervenant"
}

describe("comportement des requêtes utilisateur", () => {

  // test à faire avant chaque requête, pour s'authentifier
  beforeEach((done) => {
    axios.post(url_base + ":" + port + "/utilisateur/connexion", entete)
    .then((reponse) => {
      expect(reponse.status).toEqual(200);
      token = reponse.data.token;
      done();
    })
    .catch((err) => {
      console.log(err);
    });
  });

  //ce test appelle des fonctions en cascade pour ajouter puis supprimer un utilisateur
  //cela évite de cette manière les conflits dans la base de données
  it("essaye de créer un utilisateur, de le modifier puis de le supprimer", (done) => {
    // func_crea_utilisateur(autorisation);
    axios.post(url_base + ":" + port + "/utilisateur/creation", objet_utilisateur, { 
      headers: { 
        'Authorization' : "Bearer " + token
      }
    })
    .then((reponse) => {
      expect(reponse.status).toEqual(200);
      axios.get(url_base + ":" + port + "/utilisateur", {
        headers: {
          'Authorization' : "Bearer " + token
        }
      })
      .then((reponse) => {
        expect(reponse.status).toEqual(200);
        let dernier_utilisateur = reponse.data[Object.keys(reponse.data).sort().pop()];
        axios.put(url_base + ":" + port + "/utilisateur/" + dernier_utilisateur.id_utilisateur, objet_utilisateur, {
          headers: {
            'Authorization' : "Bearer " + token
          }
        })
        .then((reponse) => {
          expect(reponse.status).toEqual(200);
          axios.delete(url_base + ":" + port + "/utilisateur/" + dernier_utilisateur.id_utilisateur, {
            headers: {
              'Authorization' : "Bearer " + token
            }
          })
          .then((reponse) => {
            expect(reponse.status).toEqual(200);
            done();
          })
          .catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
  });

});
