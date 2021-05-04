/*

Fichier : modal-utilisateur.component.ts
Description : Les components sont la composante principale d'Angular.
Chaque component contient :
• Un template HTML qui définit le rendu visuel de la page
• Une class Typescript qui sert à gérer le comportement du component
• Un fichier SCSS qui définit les modalités stylistiques du component

Le component modal-utilisateur permet d'afficher la modal qui sert à ajouter ou modifier des utilisateurs
*/

// Importation des modules
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthentificationService } from 'src/services/authentification.service';
import { UtilisateurService } from 'src/services/utilisateur.service';

@Component({
  selector: 'app-modal-utilisateur',
  templateUrl: './modal-utilisateur.component.html',
  styleUrls: ['./modal-utilisateur.component.scss']
})
export class ModalUtilisateurComponent implements OnInit {
  // Récupération de l'utilisateur transmis à la modal (objet utilisateur)
  @Input() public utilisateur: any;
  // Tableau des types d'utilisateur
  types_utilisateur: any = [];
  // Objet contenant les informations de l'utilisateur actuellement connecté
  utilisateur_actuel = JSON.parse(localStorage.getItem('utilisateur') || '{}');

  /* Initialisation du component
  @params : modalActive - Initialisation d'une variable permettant de récupérer les propriétés de la modal actuellement active
            utilisateurApi - Initialisation du service permettant d'intéragir avec les données utilisateur
            authentificationService - Vérification de l'authentification de l'utilisateur
            router - module de navigation entre les routes
  */
  constructor(public modalActive: NgbActiveModal, private utilisateurApi: UtilisateurService, private authentificationService: AuthentificationService, private router: Router) { }

  /*
  Un hook qui est appelé après qu'Angular a initialisé toutes les données liées à des propriétés.
  La méthode ngOnInit() permet de gérer des tâches d'initialisation supplémentaires.
  Ici, on récupère la liste des types d'utilisateur pour les assignés à notre tableau d'utilisateurs précédemment déclaré
  */
  ngOnInit(): void {
    this.utilisateurApi.recupTypesUtilisateur()
    .then((types_utilisateur) => {
      this.types_utilisateur = types_utilisateur;
    })
    .catch(err => {
      console.log(err)
    });
  }

  /* Création d'un utilisateur 
  @params : form - Informations relatives au formulaire de création d'un utilisateur
  Vérifie si le formulaire est correctement rempli puis créer l'utilisateur et ferme la modal pour revenir à la liste des utilisateurs
  */
  creerUtilisateur(form: NgForm): void {
    if (form.valid) {
      this.utilisateurApi.creerUtilisateur(form.value.inp_identifiant_utilisateur, form.value.sel_type_utilisateur, form.value.inp_mot_de_passe_utilisateur)
      .then(() => {
        this.modalActive.close(this.utilisateur);
      })
      .catch(err => {
        console.log(err);
      });
    }
    else {
      alert("Vous devez remplir tous les champs du formulaire");
    }
  }

  /* Modification d'un utilisateur 
  @params : form - Informations relatives au formulaire de modification d'un utilisateur
  Vérifie si le formulaire est correctement rempli puis modifie l'utilisateur et ferme la modal pour revenir à la liste des utilisateurs
  */
  modifierUtilisateur(form: NgForm): void {
    if (form.valid) {
      this.utilisateurApi.modifierUtilisateur(this.utilisateur.id_utilisateur, form.value.sel_type_utilisateur, form.value.inp_identifiant_utilisateur, form.value.inp_mot_de_passe_utilisateur)
      .then(() => {
        this.modalActive.close(this.utilisateur);
        // Si l'utilisateur modifie ses propres informations, alors on le deconnecte après la confirmation des modifications
        if(this.utilisateur.id_utilisateur == this.utilisateur_actuel.id_utilisateur && (this.utilisateur_actuel.type_utilisateur.libelle_type_utilisateur != this.utilisateur.type_utilisateur.libelle_type_utilisateur || form.value.inp_mot_de_passe_utilisateur != "" || this.utilisateur_actuel.identifiant_utilisateur != this.utilisateur.identifiant_utilisateur)) {
          this.deconnexion();
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
    else {
      alert("Vous devez remplir tous les champs du formulaire");
    }
  }

  // Deconnexion de l'utilisateur et retour à la page de connexion
  deconnexion(): void {
    this.authentificationService.deconnexion();
    this.router.navigate(['connexion']);
  }

}
