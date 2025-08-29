import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Toast } from 'bootstrap';
import { Users } from '../../services/users/users';
import { UserResponse } from '../../models/users.models';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  constructor(private userService: Users) {}

  router = inject(Router);
  registerForm!: FormGroup;
  // handle state mngmt with signals
  status = signal<string>('');
  message = signal<string>('');

  onSubmit() {
    this.userService.registerUser(this.registerForm.value).subscribe(
      (response: UserResponse) => {
        this.status.set(response.status);
        this.message.set(response.message);

        // delay redirection to homepage. Allow users read whats written
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
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
    this.registerForm.reset();
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$',
        ),
      ]),
    });
  }
}
