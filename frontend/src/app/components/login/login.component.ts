import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm!:FormGroup

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ),
      password: new FormControl(null,
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$'),
        ]
      ),
      rememberMe: new FormControl(null),
    })
  }

  onSubmit(){
    this.loginForm.reset()
    console.log(this.loginForm.value)
  }

}
