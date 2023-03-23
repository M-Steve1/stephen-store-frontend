import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignedInUser, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/user';


  constructor(private http: HttpClient) { }

  createUser(user: User): Observable<SignedInUser> {
    const url = `${this.apiUrl}/signup`;
    return this.http.post<SignedInUser>(url, user);
  }

  authenticate(user: {user_name: string, password: string}): Observable<SignedInUser> {
    const url = `${this.apiUrl}/signin`;
    return this.http.post<SignedInUser>(url, user);
  }

  logOut() {
    sessionStorage.clear();
  }
}

