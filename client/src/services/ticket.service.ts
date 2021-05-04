/*

Fichier : ticket.service.ts
Description : Les components ne devraient pas récupérer directement des données. 
Ils devraient se concentrer sur le fait de présenter les données et déléguer l'accès aux données aux services.
Le service permet d'avoir accès aux données récupérées concernant les tickets depuis n'importe quel endroit de l'application.
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
export class TicketService {

  /* Initialisation du service
  @params : http - Initialisation d'une variable permettant de faire des requêtes http
            authentificationService - Vérification de l'authentification de l'utilisateur
  */
  constructor(private http: HttpClient, private authentificationService: AuthentificationService) { }

  /* Récupération des tickets
  @return : retourne une promesse avec la totalité des tickets
  */
  recupTickets(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(environment.urlAPI+"/ticket", { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((tickets) => {
        resolve(tickets);
      },
      (err) => {
        reject(err);
      });
    });
  }

  /* Récupération des materiels
  @return : retourne une promesse avec la totalité des materiels
  */
  recupMateriels(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(environment.urlAPI+"/materiel", { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((materiels) => {
        resolve(materiels);
      },
      (err) => {
        reject(err);
      });
    });
  }

  /* Récupération des états ticket
  @return : retourne une promesse avec la totalité des états ticket
  */
  recupEtatsTicket(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(environment.urlAPI+"/etat_ticket", { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((etats_ticket) => {
        resolve(etats_ticket);
      },
      (err) => {
        reject(err);
      });
    });
  }

  /* Suppression d'un ticket
  @params : id_ticket (explicite)
  @return : retourne une promesse avec l'id du ticket supprimé
  */
  supprimerTicket(id_ticket: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.urlAPI+"/ticket/" + id_ticket, { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((ticket : any) => {
        resolve(ticket);
      }, 
      (err) => {
        reject(err);
      });
    });
  }

  /* Création d'un ticket
  @params : id_utilisateur (le créateur du ticket)
            description_ticket (Description du problème)
            array_materiel (un tableau contenant les ids des materiels en cause)
  @return : retourne une promesse avec les informations du ticket créé
  */
  creerTicket(id_utilisateur: number, description_ticket: string, array_materiel: Array<number>) {
    return new Promise<any>((resolve, reject) => {   
      this.http.post(environment.urlAPI+"/ticket", {
        id_utilisateur: id_utilisateur,
        description_ticket: description_ticket,
        array_materiel: array_materiel
      }, { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((ticket: any) => {
        resolve(ticket);
      }, 
      (err) => {
        reject(err);
      });
    });
  }

  /* Modification d'un ticket
  @params : id_utilisateur (la personne qui modifie le ticket)
            id_ticket (explicite)
            libelle_etat_ticket (intitule de l'etat du ticket)
            description_ticket (Description du problème)
            array_materiel (un tableau contenant les ids des materiels en cause)
            @optionnel ticket_resolu (Si le ticket est résolu => true)
  @return : retourne une promesse avec les informations du ticket modifié
  */
  modifierTicket(id_utilisateur: number, id_ticket:number, libelle_etat_ticket:string, description_ticket: string, array_materiel: Array<number>, ticket_resolu? : boolean) {
    return new Promise<any>((resolve, reject) => {
      this.http.put(environment.urlAPI+"/ticket/" + id_ticket, {
        id_utilisateur: id_utilisateur,
        libelle_etat_ticket: libelle_etat_ticket,
        description_ticket: description_ticket,
        array_materiel: array_materiel,
        ticket_resolu: ticket_resolu,
      }, { 
        headers: {
          Authorization: 'Bearer ' + this.authentificationService.token,
        },
      })
      .subscribe((ticket: any) => {
        resolve(ticket);
      }, 
      (err) => {
        reject(err);
      });
    });
  }
}
