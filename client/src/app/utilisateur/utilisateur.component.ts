/*

Fichier : utilisateur.component.ts
Description : Les components sont la composante principale d'Angular.
Chaque component contient :
• Un template HTML qui définit le rendu visuel de la page
• Une class Typescript qui sert à gérer le comportement du component
• Un fichier SCSS qui définit les modalités stylistiquet du component

Le component utilisateur permet d'afficher la liste des utilisateurs et de définir les différentes actions en interaction avec la page
*/

// Importation des modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthentificationService } from 'src/services/authentification.service';
import { UtilisateurService } from 'src/services/utilisateur.service';
import { ModalSupprElementComponent } from '../modal-suppr-element/modal-suppr-element.component';
import { ModalUtilisateurComponent } from '../modal-utilisateur/modal-utilisateur.component';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {
  // Tableau d'utilisateurs
  utilisateurs: any = [];
  // Objet contenant les informations de l'utilisateur actuellement connecté
  utilisateur_actuel = JSON.parse(localStorage.getItem('utilisateur') || '{}');

  /* Initialisation du component
  @params : modalService - Initialisation d'une variable permettant de créer une modal
            utilisateurApi - Initialisation du service permettant d'intéragir avec les données utilisateur
            authentificationService - Vérification de l'authentification de l'utilisateur
            router - module de navigation entre les routes
  */
  constructor(private modalService: NgbModal, private utilisateurApi: UtilisateurService, private authentificationService: AuthentificationService, private router: Router) { }

  /*
  Un hook qui est appelé après qu'Angular a initialisé toutes les données liées à des propriétés.
  La méthode ngOnInit() permet de gérer des tâches d'initialisation supplémentaires.
  Ici, on récupère la liste des utilisateurs pour les assignés à notre tableau d'utilisateurs précédemment déclaré
  */
  ngOnInit(): void {
    this.utilisateurApi.recupUtilisateurs()
    .then((utilisateurs) => {
      this.utilisateurs = utilisateurs;
    })
    .catch(err => {
      console.log(err)
    });
  }

  /* Ouverture de la modal utilisateur (ajout et modification d'un utilisateur)
  @params : @optionnel utilisateur - les informations de l'utilisateur à envoyer à la modal (vide si création d'un nouvel utilisateur)
  */
  modalUtilisateur(utilisateur?: any) {
    const modalRef = this.modalService.open(ModalUtilisateurComponent, { size: "dialog-centered" });
    modalRef.componentInstance.utilisateur = utilisateur;
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
  modalSupprElement(element: any) {
    const modalRef = this.modalService.open(ModalSupprElementComponent, { size: "dialog-centered" });
    modalRef.componentInstance.element = element;
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