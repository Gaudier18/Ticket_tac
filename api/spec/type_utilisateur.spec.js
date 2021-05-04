var entete = require("./entete");
var dotenv = require("dotenv");
const axios = require('axios');
dotenv.config();
var token;

const url_base = process.env.API_URL == undefined ? "http://localhost" : process.env.API_URL;
const port = process.env.PORT == undefined ? "3000" : process.env.PORT;

describe("comportement des requêtes type utilisateur", () => {

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

  //test selectionne tout les type utilisateurs, retourne un code 200
  it("retourne code 200", (done) => {
    axios.get(url_base + ":" + port + "/type_utilisateur", {
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
  });
});
