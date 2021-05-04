/*

Fichier : connexion.component.ts
Description : Les components sont la composante principale d'Angular.
Chaque component contient :
• Un template HTML qui définit le rendu visuel de la page
• Une class Typescript qui sert à gérer le comportement du component
• Un fichier SCSS qui définit les modalités stylistiques du component

Le component connexion permet d'afficher la page de connexion et de définir les différentes actions en interaction avec celle-ci
*/

// Importation des modules
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/services/authentification.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {
  // Initialisation de la variable qui sera rempli avec les messages d'erreurs à la connexion (s'il y en a)
  erreur: string = '';

  /* Initialisation du component
  @params : authentificationService - Vérification de l'authentification de l'utilisateur
            router - module de navigation entre les routes
  */
  constructor(private authentificationService: AuthentificationService, private router: Router) { }

  ngOnInit(): void {
  }

  /* Connexion de l'utilisateur 
  @params : form - Informations relatives au formulaire de connexion
  Navigue à la page d'accueil si la connexion s'effectue sans accroc, affiche un message d'erreur autrement
  */
  connexion(form: NgForm): void {
    this.erreur = '';
    if(form.valid) {
      this.authentificationService.connexion(form.value.inp_identifiant, form.value.inp_mot_de_passe)
      .then(() => {
        this.router.navigate(['']);
      })
      .catch((err) => {
        if(err.status == 403)
          this.erreur = "Identifiant ou mot de passe incorrect.";
        else
          this.erreur = err.message;
      });
    }
  }

}
