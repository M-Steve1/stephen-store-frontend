import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css', '../sign-up/sign-up.component.css']
})
export class SignInComponent {
  userName: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}
  
  signIn(): void {
    const user = {
      user_name: this.userName,
      password: this.password
    }
    this.userService.authenticate(user).pipe(
      catchError(async (err) => {
        this.errorMessage = err.error;
      })
    ).subscribe(res => {
      if (res !== undefined) {
        sessionStorage.setItem('myToken', res.token);
        sessionStorage.setItem('userId', (res.userId as number).toString());
        this.router.navigate(['']);
      }
    })

    this.userName = '';
    this.password = '';
  }
  
}
