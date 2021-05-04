/*

Fichier : modal-suppr-element.component.ts
Description : Les components sont la composante principale d'Angular.
Chaque component contient :
• Un template HTML qui définit le rendu visuel de la page
• Une class Typescript qui sert à gérer le comportement du component
• Un fichier SCSS qui définit les modalités stylistiques du component

Le component modal-suppr-element permet d'afficher la modal qui sert à supprimer des utilisateurs ou des tickets
*/

// Importation des modules
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from 'src/services/ticket.service';
import { UtilisateurService } from 'src/services/utilisateur.service';

@Component({
  selector: 'app-modal-suppr-element',
  templateUrl: './modal-suppr-element.component.html',
  styleUrls: ['./modal-suppr-element.component.scss']
})
export class ModalSupprElementComponent implements OnInit {
  // Récupération de l'élément transmis à la modal (objet utilisateur ou ticket)
  @Input() public element: any;
  
  /* Initialisation du component
  @params : modalActive - Initialisation d'une variable permettant de récupérer les propriétés de la modal actuellement active
            ticketApi - Initialisation du service permettant d'intéragir avec les données ticket
            utilisateurApi - Initialisation du service permettant d'intéragir avec les données utilisateur
  */
  constructor(public modalActive: NgbActiveModal, private ticketApi: TicketService, private utilisateurApi: UtilisateurService) { }

  ngOnInit(): void {
  }

  // Suppression du ticket contenu dans la variable element
  supprimerTicket() {
    this.ticketApi.supprimerTicket(this.element.id_ticket)
    .then(() => {
      this.modalActive.close(this.element);
    })
    .catch(err => {
      console.log(err)
    });
  }

  // Suppression de l'utilisateur contenu dans la variable element
  supprimerUtilisateur() {
    this.utilisateurApi.supprimerUtilisateur(this.element.id_utilisateur)
    .then(() => {
      this.modalActive.close(this.element);
    })
    .catch(err => {
      console.log(err)
    });
  }

}
