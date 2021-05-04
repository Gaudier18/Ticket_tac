import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketComponent } from './ticket/ticket.component';
import { AuthentificationGuard } from 'src/guards/authentification.guard';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { ConnexionComponent } from './connexion/connexion.component';

// Déclaration des routes avec leurs configurations et restrictions respectives
const routes: Routes = [{
  path: '',
  pathMatch:  "full",
  redirectTo:  "tickets"
},
{
  path: 'connexion',
  component: ConnexionComponent
},
{
  path: 'utilisateurs',
  component: UtilisateurComponent,
  canActivate: [AuthentificationGuard]
},
{
  path: 'tickets',
  component: TicketComponent,
  canActivate: [AuthentificationGuard]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
