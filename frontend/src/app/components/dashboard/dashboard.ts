import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { LocalStorage } from '../../services/local-storage/local-storage';
import { DecodedTokenPayload, UserRoles } from '../../models/users.models';
import { Users } from '../../services/users/users';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  constructor(
    public ls: LocalStorage,
    private userService: Users,
    private authService: Auth,
  ) {}

  token = signal<string>('');
  id = signal<number>(0);
  decoded_token = signal<DecodedTokenPayload>({
    id: 0,
    username: '',
    email: '',
    role: '',
    iat: 0,
    exp: 0,
  });

  logoutUser() {
    // call logout method. removes all data in local sorage
    // and redirects to login page
    this.authService.logout();
  }

  ngOnInit(): void {
    // Check for token in query params (from OAuth redirect)
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.ls.setItem('token', token);
        this.authService.login();
        this.router.navigate(['/dashboard']);
        return;
      }
    });

    this.token.set(this.ls.getItem('token') ?? '');
    if (this.token()) {
      this.decoded_token.set(jwtDecode<DecodedTokenPayload>(this.token()));
    }

    //navigate to user id profile
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.id.set(Number(params.get('id')));
        return this.userService.getUser();
      }),
    );
  }
}
