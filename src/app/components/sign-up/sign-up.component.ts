import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  fName: string = '';
  lName: string = '';
  userName: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  navigate() {
    this.router.navigate(['']);
  }


  createUser(): void {
    const user: User = {
      first_name: this.fName,
      last_name: this.lName,
      user_name: this.userName,
      password: this.password
    }

    this.userService.createUser(user).pipe(
      catchError(async (err) => {
        this.errorMessage = err.error;
      })
    ).subscribe(
      res => {
        if (res !== undefined) {
          sessionStorage.setItem('myToken', res.token);
          sessionStorage.setItem('userId', (res.userId as number).toString());
          this.navigate();
        }
      }
    );

    this.fName = '';
    this.lName = '';
    this.userName = '';
    this.password = '';
    this.errorMessage = '';
  }
}
