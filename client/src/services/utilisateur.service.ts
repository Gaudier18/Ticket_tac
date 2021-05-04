/*

Fichier : utilisateur.service.ts
Description : Les components ne devraient pas récupérer directement des données. 
Ils devraient se concentrer sur le fait de présenter les données et déléguer l'accès aux données aux services.
Le service permet d'avoir accès aux données récupérées concernant les utilisateurs depuis n'importe quel endroit de l'application.
Dans chaque requête on ajoute en headers le token récupéré à la connexion pour pouvoir s'authentifier auprès de l'API

*/

// Importation des modules
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthentificationService } from './authentification.service';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  /* Initialisation du service
  @params : http - Initialisation d'une variable permettant de faire des requêtes http
            authentificationService - Vérification de l'authentification de l'utilisateur
  */
  constructor(private http: HttpClient, private authentificationService: AuthentificationService) { }

  /* Récupération des utilisateurs
  @return : retourne une promesse avec la totalité des utilisateurs
  */
  recupUtilisateurs(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(environment.urlAPI+"/utilisateur", { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((utilisateurs) => {
        resolve(utilisateurs);
      },
      (err) => {
        reject(err);
      });
    });
  }

  /* Récupération des types utilisateur
  @return : retourne une promesse avec la totalité des types utilisateur
  */
  recupTypesUtilisateur(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(environment.urlAPI+"/type_utilisateur", { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((types_utilisateur) => {
        resolve(types_utilisateur);
      },
      (err) => {
        reject(err);
      });
    });
  }

  /* Suppression d'un utilisateur
  @params : id_utilisateur (explicite)
  @return : retourne une promesse avec l'identifiant de l'utilisateur supprimé
  */
  supprimerUtilisateur(id_utilisateur: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.urlAPI+"/utilisateur/" + id_utilisateur, { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((utilisateur: any) => {
        resolve(utilisateur);
      }, 
      (err) => {
        reject(err);
      });
    });
  }

  /* Création d'un utilisateur
  @params : identifiant_utilisateur (l'identifiant de l'utilisateur, notamment utile à la connexion)
            libelle_type_utilisateur (Intitulé du type d'utilisateur)
            mot_de_passe (mot de passe de l'utilisateur, notamment utile à la connexion)
  @return : retourne une promesse avec les informations de l'utilisateur créé
  */
  creerUtilisateur(identifiant_utilisateur: string, libelle_type_utilisateur: string, mot_de_passe: string) {
    return new Promise<any>((resolve, reject) => {   
      this.http.post(environment.urlAPI+"/utilisateur/creation", {
        identifiant_utilisateur: identifiant_utilisateur,
        libelle_type_utilisateur: libelle_type_utilisateur,
        mot_de_passe: mot_de_passe
      }, { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((utilisateur: any) => {
        resolve(utilisateur);
      }, 
      (err) => {
        reject(err);
      });
    });
  }

  /* Modification d'un utilisateur
  @params : id_utilisateur (l'id de l'utilisateur que l'on veut modifier)
            libelle_type_utilisateur (Intitulé du type d'utilisateur)
            identifiant_utilisateur (l'identifiant de l'utilisateur, notamment utile à la connexion)
            @optionnel mot_de_passe (mot de passe de l'utilisateur, notamment utile à la connexion)
  @return : retourne une promesse avec les informations de l'utilisateur modifié
  */
  modifierUtilisateur(id_utilisateur: number, libelle_type_utilisateur:string, identifiant_utilisateur: string, mot_de_passe? : string) {
    return new Promise<any>((resolve, reject) => {
      this.http.put(environment.urlAPI+"/utilisateur/" + id_utilisateur, {
        identifiant_utilisateur: identifiant_utilisateur,
        libelle_type_utilisateur: libelle_type_utilisateur,
        mot_de_passe: mot_de_passe == "" ? null : mot_de_passe
      }, { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((res: any) => {
        resolve(res);
      }, 
      (err) => {
        reject(err);
      });
    });
  }
}
