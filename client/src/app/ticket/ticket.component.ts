/*

Fichier : ticket.component.ts
Description : Les components sont la composante principale d'Angular.
Chaque component contient :
• Un template HTML qui définit le rendu visuel de la page
• Une class Typescript qui sert à gérer le comportement du component
• Un fichier SCSS qui définit les modalités stylistiques du component

Le component ticket permet d'afficher la liste des tickets et de définir les différentes actions en interaction avec la page
*/

// Importation des modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthentificationService } from 'src/services/authentification.service';
import { TicketService } from 'src/services/ticket.service';
import { ModalSupprElementComponent } from '../modal-suppr-element/modal-suppr-element.component';
import { ModalTicketComponent } from '../modal-ticket/modal-ticket.component';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  // Tableau de tickets
  tickets: any = [];
  // Objet contenant les informations de l'utilisateur actuellement connecté
  utilisateur_actuel = JSON.parse(localStorage.getItem('utilisateur') || '{}');

  /* Initialisation du component
  @params : document - Initialisation d'une variable permettant d'intéragir avec le DOM
            modalService - Initialisation d'une variable permettant de créer une modal
            ticketApi - Initialisation du service permettant d'intéragir avec les données ticket
            authentificationService - Vérification de l'authentification de l'utilisateur
            router - module de navigation entre les routes
  */
  constructor(@Inject(DOCUMENT) private document: any, private modalService: NgbModal, private ticketApi: TicketService, private authentificationService: AuthentificationService, private router: Router) { }

  /*
  Un hook qui est appelé après qu'Angular a initialisé toutes les données liées à des propriétés.
  La méthode ngOnInit() permet de gérer des tâches d'initialisation supplémentaires.
  Ici, on récupère la liste des tickets pour les assignés à notre tableau de tickets précédemment déclaré
  */
  ngOnInit(): void {
    this.ticketApi.recupTickets()
    .then((tickets) => {
      this.tickets = tickets;
    })
    .catch(err => {
      console.log(err)
    });
  }

  /* Ouverture de la modal ticket (ajout et modification d'un ticket)
  @params : @optionnel ticket - les informations du ticket à envoyer à la modal (vide si création d'un nouveau ticket)
  */
  modalTicket(ticket?: any) {
    const modalRef = this.modalService.open(ModalTicketComponent, { size: "dialog-centered" });
    modalRef.componentInstance.ticket = ticket;
    modalRef.result
    .then(() => {
      // A la fermeture de la modal
      this.ngOnInit();
    },
    () => {
      // Après la fermeture de la modal
      this.ngOnInit();
    });
  }

  /* Ouverture de la modal permettant de supprimer un élément (utilisateur ou ticket)
  @params : element - les informations de l'utilisateur ou du ticket à envoyer à la modal
  */
  modalSupprElement(element?: any) {
    const modalRef = this.modalService.open(ModalSupprElementComponent, { size: "dialog-centered" });
    modalRef.componentInstance.element = element;
    modalRef.result
    .then(() => {
      // A la fermeture de la modal
      this.document.getElementById('table_tickets').deleteRow(1);
      this.ngOnInit();
    },
    () => {
      // Après la fermeture de la modal
      this.document.getElementById('table_tickets').deleteRow(1);
      this.ngOnInit();
    });
  }

  /* Navigation vers une nouvelle page
  @params : nom_page - le nom de la page vers laquelle se rediriger
  */
  navigation(nom_page: string): void {
    this.router.navigate([nom_page])
  }

  // Deconnexion de l'utilisateur et retour à la page de connexion
  deconnexion(): void {
    this.authentificationService.deconnexion();
    this.router.navigate(['connexion']);
  }
}
