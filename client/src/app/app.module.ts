import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { UtilisateurComponent } from './utilisateur/utilisateur.component';
import { TicketComponent } from './ticket/ticket.component';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalTicketComponent } from './modal-ticket/modal-ticket.component';
import { ModalSupprElementComponent } from './modal-suppr-element/modal-suppr-element.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModalUtilisateurComponent } from './modal-utilisateur/modal-utilisateur.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    ConnexionComponent,
    UtilisateurComponent,
    TicketComponent,
    ModalTicketComponent,
    ModalSupprElementComponent,
    ModalUtilisateurComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
