import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { LocalStorage } from '../../services/local-storage/local-storage';
import { DecodedTokenPayload, UserRoles } from '../../models/users.models';
import { Users } from '../../services/users/users';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly route = inject(ActivatedRoute);
  constructor(
    public ls: LocalStorage,
    private userService: Users,
  ) {}

  token = signal<string>('');
  id = signal<number>(0);
  decoded_token = signal<DecodedTokenPayload>({
    id: '',
    username: '',
    email: '',
    role: '',
    iat: 0,
    exp: 0,
  });

  ngOnInit(): void {
    this.token.set(this.ls.getItem('token') ?? '');
    this.decoded_token.set(jwtDecode<DecodedTokenPayload>(this.token()));

    //navigate to user id profile
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.id.set(Number(params.get('id')));
        return this.userService.getUser();
      }),
    );
  }
}
