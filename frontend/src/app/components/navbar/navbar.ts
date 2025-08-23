import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { LocalStorage } from '../../services/local-storage/local-storage';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  constructor(
    public authService: Auth, // public for acces on template side
    private router: Router,
    private ls: LocalStorage,
  ) {}

  //signals for state mngmt
  wishlist = signal<number>(0);
  cart = signal<number>(0);

  logoutUser() {
    // call logout method. removes all data in local sorage
    // and redirects to login page
    this.authService.logout();
  }

  ngOnInit(): void {
    console.log(this.authService.showStatus())
  }
}
