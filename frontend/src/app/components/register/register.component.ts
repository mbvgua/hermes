import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  registerForm!:FormGroup

  ngOnInit(): void {
    this.registerForm= new FormGroup({
      username:new FormControl(
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]
      ),
      email:new FormControl(
        null,
        [
          Validators.required,
          Validators.email
        ]
      ),
      password:new FormControl(
        null,
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$')
        ]
      ),
      tos:new FormControl(
        null,
        Validators.requiredTrue
      )
    })
  }

  onSubmit(){
    console.log(this.registerForm.value)
    this.registerForm.reset
  }

}
