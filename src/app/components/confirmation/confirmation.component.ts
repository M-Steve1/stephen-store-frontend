import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  fullName: string;
  totalPrice: number = 0;

  constructor(private router: Router) {
    this.fullName = this.router
    .getCurrentNavigation()
    ?.extras.state
    ?.['fullName'];
    
    this.totalPrice = this.router
    .getCurrentNavigation()
    ?.extras.state
    ?.['totalPrice'];
  }
}
