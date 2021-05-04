import { TestBed } from '@angular/core/testing';
import { UtilisateurService } from './utilisateur.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('UtilisateurService', () => {
  let service: UtilisateurService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UtilisateurService]
    });
    service = TestBed.inject(UtilisateurService);

    
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });
});
