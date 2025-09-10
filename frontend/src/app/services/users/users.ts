import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../models/users.models';

@Injectable({
  providedIn: 'root',
})
export class Users {
  constructor(private http: HttpClient) {}
  private readonly base_url = 'http://localhost:4000/v1/';

  // register new users
  registerUser(user: IUser): Observable<any> {
    return this.http.post(this.base_url + 'auth/register', user);
  }

  // login existing users
  loginUser(user: IUser): Observable<any> {
    return this.http.post(this.base_url + 'auth/login', user);
  }

  // get user by id
  // used any, since string returns an error
  getUser(): Observable<any> {
    return this.http.get(this.base_url + 'users/get-user');
  }
  // get all users
  // update user
  // delete user
}
