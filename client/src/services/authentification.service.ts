/*

Fichier : authentification.service.ts
Description : Les components ne devraient pas récupérer directement des données. 
Ils devraient se concentrer sur le fait de présenter les données et déléguer l'accès aux données aux services.
Le service permet d'avoir accès aux données récupérées depuis n'importe quel endroit de l'application.

*/

// Importation des modules
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  // Définition du token en tant que variable public (accès n'importe où sans accesseurs)
  public token: string = '';
  // Objet utilisateur
  utilisateur: any = {};

  /* Initialisation du service
  @params : http - Initialisation d'une variable permettant de faire des requêtes http
  */
  constructor(private http: HttpClient) {
    var token = localStorage.getItem('token');
    var utilisateur = localStorage.getItem('utilisateur');
    if (token != undefined && utilisateur != undefined) {
      this.token = token;
      this.utilisateur = JSON.parse(utilisateur);
    }
  }

  // Deconnexion de l'utilisateur - Réinitialisation du localStorage
  public deconnexion() {
    this.token = '';
    this.utilisateur = {};
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
  }

  /* Connexion de l'utilisateur
  @params : identifiant_utilisateur (explicite)
            mot_de_passe (explicite)
  @return : retourne une promesse avec le resultat de la requête (token)
  */
  public connexion(identifiant_utilisateur: string, mot_de_passe: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(environment.urlAPI + "/utilisateur/connexion", {
        identifiant_utilisateur: identifiant_utilisateur,
        mot_de_passe: mot_de_passe,
      })
      .subscribe((objet_connexion: any) => {
        localStorage.setItem('token', objet_connexion.token);
        localStorage.setItem('utilisateur', JSON.stringify(objet_connexion.utilisateur));
        this.token = objet_connexion.token;
        this.utilisateur = objet_connexion.utilisateur;
        resolve(objet_connexion.token);
      }, 
      (err) => {
        reject(err);
      });
    });
  }
}
