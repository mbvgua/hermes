import { Component, OnInit, signal } from '@angular/core';
import { LocalStorage } from '../../services/local-storage/local-storage';
import { jwtDecode } from 'jwt-decode';
import { DecodedTokenPayload, UserRoles } from '../../models/users.models';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  constructor(public ls: LocalStorage) {}

  token = signal<string>('');
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
  }
}
