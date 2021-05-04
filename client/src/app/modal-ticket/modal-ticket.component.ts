/*

Fichier : modal-ticket.component.ts
Description : Les components sont la composante principale d'Angular.
Chaque component contient :
• Un template HTML qui définit le rendu visuel de la page
• Une class Typescript qui sert à gérer le comportement du component
• Un fichier SCSS qui définit les modalités stylistiques du component

Le component modal-ticket permet d'afficher la modal qui sert à ajouter ou modifier des tickets
*/

// Importation des modules
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TicketService } from 'src/services/ticket.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-modal-ticket',
  templateUrl: './modal-ticket.component.html',
  styleUrls: ['./modal-ticket.component.scss']
})
export class ModalTicketComponent implements OnInit {
  // Récupération du ticket transmis à la modal (objet ticket)
  @Input() public ticket: any;
  // Tableau de materiels
  materiels: any = [];
  // Tableau des materiels selectionnés dans le selecteur multiple (<ng-multiselect-dropdown>)
  materiels_selectionnes: any = [];
  // Tableau des etats ticket
  etats_ticket: any = [];
  // Objet contenant les informations de l'utilisateur actuellement connecté
  utilisateur_actuel = JSON.parse(localStorage.getItem('utilisateur') || '{}');
  // Définition des paramètres pour le selecteur multiple
  sel_materiels_params : IDropdownSettings = {};
  
  /* Initialisation du component
  @params : modalActive - Initialisation d'une variable permettant de récupérer les propriétés de la modal actuellement active
            ticketApi - Initialisation du service permettant d'intéragir avec les données ticket
  */
  constructor(public modalActive: NgbActiveModal, private ticketApi: TicketService) { }

  /*
  Un hook qui est appelé après qu'Angular a initialisé toutes les données liées à des propriétés.
  La méthode ngOnInit() permet de gérer des tâches d'initialisation supplémentaires.
  Ici, on récupère la liste des etats ticket et materiels pour les assignés à nos tableaux précédemment déclaré
  */
  ngOnInit(): void {
    this.ticketApi.recupMateriels()
    .then((materiels) => {
      this.materiels = materiels;
    })
    .catch(err => {
      console.log(err)
    });
    this.ticketApi.recupEtatsTicket()
    .then((etats_ticket) => {
      this.etats_ticket = etats_ticket;
    })
    .catch(err => {
      console.log(err)
    });
    // Assignation des paramètres pour le selecteur multiple
    this.sel_materiels_params = {
      singleSelection: false,
      idField: 'id_materiel',
      textField: 'type_materiel',
      selectAllText: 'Tout sélectionner',
      unSelectAllText: 'Déselectionner tout',
      itemsShowLimit: 4,
    };
    // Si on ajoute un ticket, alors aucun materiels n'est pré-sélectionné
    if(this.ticket !== undefined) {
      this.materiels_selectionnes = this.ticket.materiels
    }
  }

  /* Evenement appelé lors de la selection d'un nouveau materiel dans le selecteur multiple
  @params : materiel - le materiel à ajouter au ticket
  */
  onMaterielSelect(materiel: any) {
    this.materiels_selectionnes.push(materiel)
  }

  /* Création d'un ticket 
  @params : form - Informations relatives au formulaire de création d'un ticket
  Vérifie si le formulaire est correctement rempli puis créer le ticket et ferme la modal pour revenir à la liste des tickets
  */
  creerTicket(form: NgForm): void {
    // Élimination des doublons liés à un bug avec le module de selections multiples
    this.materiels_selectionnes = this.materiels_selectionnes.filter((v: any,i: any,a: any[])=>a.findIndex((t: any)=>(JSON.stringify(t) === JSON.stringify(v)))===i)
    if (form.valid && this.materiels_selectionnes.length > 0) {
      this.ticketApi.creerTicket(this.utilisateur_actuel.id_utilisateur, form.value.tex_description_ticket, this.materiels_selectionnes.map((obj: { id_materiel: number; }) => obj.id_materiel))
      .then(() => {
        this.modalActive.close(this.ticket);
      })
      .catch(err => {
        console.log(err);
      });
    }
    else {
      alert("Vous devez remplir tous les champs du formulaire");
    }
  }

  /* Modification d'un ticket 
  @params : form - Informations relatives au formulaire de modification d'un ticket
  Vérifie si le formulaire est correctement rempli puis modifie le ticket et ferme la modal pour revenir à la liste des tickets
  */
  modifierTicket(form: NgForm): void {
    // Élimination des doublons liés à un bug avec le module de selections multiples
    this.materiels_selectionnes = this.materiels_selectionnes.filter((v: any,i: any,a: any[])=>a.findIndex((t: any)=>(JSON.stringify(t) === JSON.stringify(v)))===i)
    if (form.valid && this.materiels_selectionnes.length > 0) {
      // Si le ticket est résolu on passe un paramètre en plus à la méthode modifierTicket() (le booléen ticket_résolu => voir ticket.service.ts)
      if(form.value.sel_etat_ticket === "Résolu") {
        this.ticketApi.modifierTicket(this.utilisateur_actuel.id_utilisateur, this.ticket.id_ticket, form.value.sel_etat_ticket, form.value.tex_description_ticket, this.materiels_selectionnes.map((obj: { id_materiel: number; }) => obj.id_materiel), true)
        .then(() => {
          this.modalActive.close(this.ticket);
        })
        .catch(err => {
          console.log(err);
        });
      }
      else {
        this.ticketApi.modifierTicket(this.utilisateur_actuel.id_utilisateur, this.ticket.id_ticket, form.value.sel_etat_ticket, form.value.tex_description_ticket, this.materiels_selectionnes.map((obj: { id_materiel: number; }) => obj.id_materiel))
        .then(() => {
          this.modalActive.close(this.ticket);
        })
        .catch(err => {
          console.log(err);
        });
      }
    }
    else {
      alert("Vous devez remplir tous les champs du formulaire");
    }
  }

}
