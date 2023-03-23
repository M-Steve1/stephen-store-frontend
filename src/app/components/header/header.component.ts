import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'StephenStore'
  faShop = faShoppingCart
  userName: string = '';
  @Input() cartCount: number = 0;

  constructor (private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
  }


  hasRoute(route: string[]): boolean {
    if (this.router.url === route[0]) {
      return true;
    } else if (this.router.url === route[1]) {
      return true;
    } else {
      return false;
    }
  }

  signInOrLogOut(): boolean {
    const isLoggedIn = sessionStorage.getItem("myToken");
    if (isLoggedIn) {
      return true;
    } else {
      return false;
    }
  }

  logOut() {
    this.userService.logOut();
  }
}
