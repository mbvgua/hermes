import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule,CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

}
