import { TestBed } from '@angular/core/testing';
import { AuthentificationService } from './authentification.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('AuthentificationService', () => {
  let service: AuthentificationService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthentificationService]
    });
    service = TestBed.inject(AuthentificationService);

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });
});
