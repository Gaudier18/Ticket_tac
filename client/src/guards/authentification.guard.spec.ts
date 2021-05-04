import { TestBed } from '@angular/core/testing';
import { AuthentificationGuard } from './authentification.guard';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthentificationGuard', () => {
  let guard: AuthentificationGuard;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthentificationGuard]
    });
    guard = TestBed.inject(AuthentificationGuard);

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('devrait être créé', () => {
    expect(guard).toBeTruthy();
  });
});
