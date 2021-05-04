/*

Fichier : authentification.guard.ts
Description : C'est un service Angular qui implemente des interfaces comme
La méthode "canActivate"  verifie si un utilisateur peut visiter une route.
Ici on restreint l'accès au reste de l'application tant que l'utilisateur n'est pas connecté

*/

// Importation des modules
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from 'src/services/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationGuard implements CanActivate {

  /* Initialisation du guard
  @params : authentificationService - Vérification de l'authentification de l'utilisateur
            router - module de navigation entre les routes
  */
  constructor(private authentificationService: AuthentificationService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Regarde si l'utilisateur dispose d'un token sinon le redirige vers la page de connexion
    if (this.authentificationService.token != '')
      return true;
    else
      this.router.navigate(['connexion']);
    return false;
  }

}