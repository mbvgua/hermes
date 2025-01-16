import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  @ViewChild('toggleOpen', {static:true}) toggleOpen!: ElementRef
  @ViewChild('toggleClose', {static:true}) toggleClose!: ElementRef
  @ViewChild('collapseMenu', {static:true}) collapseMenu!: ElementRef
  @ViewChild('cart', {static:true}) cart!: ElementRef
  
  handleClick() {
    if (this.collapseMenu.nativeElement.style.display === 'block') {
      this.collapseMenu.nativeElement.style.display = 'none';
    } else {
      this.collapseMenu.nativeElement.style.display = 'block';
    }
  }

  ngOnInit(): void {
    this.toggleOpen.nativeElement.addEventListener('click', this.handleClick.bind(this));
    this.toggleClose.nativeElement.addEventListener('click', this.handleClick.bind(this));
  }
  
}
