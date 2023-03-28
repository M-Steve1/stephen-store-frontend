import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs'
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private token = sessionStorage.getItem("myToken");
  private headerObj = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
  private apiUrl: string = 'https://stephenstore-serverside.vercel.app/order';

  constructor(private http: HttpClient) { }

  createOrder(order: Order): Observable<Order> {
    const url = `${this.apiUrl}/create-order/${order.user_id}`;
    return this.http.post<Order>(url, {cartId: order.cart_id, status: order.status}, {headers: this.headerObj});
  }

}
