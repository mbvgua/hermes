import { inject, Injectable } from '@angular/core';
import { LocalStorage } from '../local-storage/local-storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private ls: LocalStorage) {}

  private isLoggedIn = false;
  private router = inject(Router);

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
    this.ls.removeAllItems(); // remove all user data in local storage
    this.router.navigate(['/']); // navigate to homepage
  }

  // call when you need to know login status
  showStatus() {
    return this.isLoggedIn;
  }
}
