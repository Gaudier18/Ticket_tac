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

let ticket_crea = {
  "id_utilisateur": "1",
  "description_ticket": generer_chaine_aletoire(50),
  "array_materiel": [1, 2]
};

let ticket_modif = {
  "id_utilisateur": "1",
  "description_ticket": generer_chaine_aletoire(50),
  "array_materiel": [2, 3],
  "libelle_etat_ticket": "En cours"
};

describe("comportement des requêtes ticket", () => {

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

  //test selectionne tout les tickets, si il n'y en a aucun, alors on saute le test
  it("retourne code 200", (done) => {
    axios.get(url_base + ":" + port + "/ticket", {
      headers: {
        'Authorization': "Bearer " + token
      }
    })
    .then((reponse) => {
      expect(reponse.status).toEqual(200);
      done();
    })
    .catch((err) => {
      console.log(err);
    });
  });

  //ici, on crée, modifie et suprrime un ticket de test, on test le retour des requêtes
  it("essaye de créer un ticket, de le modifier puis de le supprimer", (done) => {
    //création
    axios.post(url_base + ":" + port + "/ticket", ticket_crea, { 
      headers: { 
        'Authorization' : "Bearer " + token
      }
    })
    .then((reponse) => {
      expect(reponse.status).toEqual(200);
      axios.get(url_base + ":" + port + "/ticket", {
        headers: {
          'Authorization' : "Bearer " + token
        }
      })
      .then((reponse) => {
        expect(reponse.status).toEqual(200);
        let dernier_ticket = reponse.data[Object.keys(reponse.data).sort().pop()];
        axios.put(url_base + ":" + port + "/ticket/" + dernier_ticket.id_ticket, ticket_modif, {
          headers: {
            'Authorization' : "Bearer " + token
          }
        })
        .then((reponse) => {
          expect(reponse.status).toEqual(200);
          axios.delete(url_base + ":" + port + "/ticket/" + dernier_ticket.id_ticket, {
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
