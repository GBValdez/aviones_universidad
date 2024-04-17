import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { authUserInterface } from '@auth/interface/auth.inteface';
import { environment } from '@env/environment';
import { AES, enc } from 'crypto-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    // private cookiesSvc: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}
  authObs: BehaviorSubject<authUserInterface | null> =
    new BehaviorSubject<authUserInterface | null>(null);

  getObservable(): Observable<authUserInterface | null> {
    return this.authObs.asObservable();
  }
  nextAuth(auth: authUserInterface | null) {
    this.authObs.next(auth);
  }

  hasAuth(): boolean {
    return localStorage.getItem('auth') != null;
    // this.cookiesSvc.check('auth');
  }

  setAuth(newAuth: authUserInterface) {
    const authBody = AES.encrypt(
      JSON.stringify(newAuth),
      environment.key
    ).toString();
    localStorage.setItem('auth', authBody);
    // this.cookiesSvc.set('auth', authBody, 1);
    this.authObs.next(newAuth);
  }
  getAuth(): authUserInterface | null {
    const authBody: string = localStorage.getItem('auth') ?? '';
    // this.cookiesSvc.get('auth');
    if (authBody.trim().length > 0 && authBody != '') {
      const DECRYPT_TEXT: string = AES.decrypt(
        authBody,
        environment.key
      ).toString(enc.Utf8);
      return JSON.parse(DECRYPT_TEXT);
    }
    return null;
  }
  logout() {
    if (this.hasAuth()) {
      localStorage.removeItem('auth');
      // this.cookiesSvc.delete('auth');
      this.authObs.next(null);
      this.router.navigate(['/home']);
    }
  }
}
