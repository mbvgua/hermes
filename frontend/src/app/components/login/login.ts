import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorage } from '../../services/local-storage/local-storage';
import { Users } from '../../services/users/users';
import { UserResponse } from '../../models/users.models';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  constructor(
    private ls: LocalStorage,
    private userService: Users,
    private authService: Auth,
  ) {}

  router = inject(Router);
  loginForm!: FormGroup;
  status = signal<string>('');
  message = signal<string>('');

  onSubmit() {
    this.userService.loginUser(this.loginForm.value).subscribe(
      (response: UserResponse) => {
        this.ls.removeAllItems();
        this.status.set(response.status);
        this.message.set(response.message);
        console.log(response.data?.token);
        //TODO: figure out how to decode this token without passing
        //it as a decoded toke from the backend side

        setTimeout(() => {
          if (response.data?.token) {
            this.ls.setItem('token', response.data?.token);

            //navigate to main dashboard
            this.authService.login();
            this.router.navigate(['dashboard']);
          }
        }, 2000);
      },
      (error: UserResponse | any) => {
        this.status.set(error.status);
        this.message.set(error.message);
        // if statements to handle diff kinds of nesting
        if (error.error.code == 422 || error.error.code == 500) {
          this.status.set(error.error.status);
          this.message.set(error.error.message);
        }
      },
    );
    console.log(this.loginForm.value);
    this.loginForm.reset();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$',
        ),
      ]),
    });
  }
}
