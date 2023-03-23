import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private token = sessionStorage.getItem('myToken');
  private headerObj = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);

  constructor(private http: HttpClient) { }

  create(cart: Cart): Observable<Cart> {
    const url = `${this.apiUrl}/create`;
    return this.http.post<Cart>(url, cart, {headers: this.headerObj});
  }

  addProductInCart(productToAdd: {cart_id: string, product_id: string, product_quantity: number}): Observable<{cart_id: string, product_id: string, product_quantity: number}> {
    const url = `${this.apiUrl}/add-product`;
    return this.http.post<{cart_id: string, product_id: string, product_quantity: number}>(url, productToAdd, {headers: this.headerObj});
  }

  isProductInCart(productInCart: {cart_id: string, product_id: string}): Observable<{cart_id: string, product_id: string}> {
    const url = `${this.apiUrl}/show-product-cart`;
    return this.http.post<{cart_id: string, product_id: string}>(url, productInCart, {headers: this.headerObj});
  }

  getCartByUserId(userId: string): Observable<Cart> {
    const url = `${this.apiUrl}/show-cart/${userId}`;
    return this.http.get<Cart>(url, {headers: this.headerObj});
  }

  getProductsInCart(cartId: string): Observable<{id: string | number, cart_id: string, product_id: string, product_quantity: number}[]> {
    const url = `${this.apiUrl}/products-in-cart/${cartId}`;
    return this.http.get<{id: string | number, cart_id: string, product_id: string, product_quantity: number}[]>(url, {headers: this.headerObj});
  }

  updateProductQuantity(id: string, product_quantity: number): Observable<{id: string | number, cart_id: string, product_id: string, product_quantity: number}> {
    const url = `${this.apiUrl}/update-product-quantity`;
    return this.http.put<{id: string | number, cart_id: string, product_id: string, product_quantity: number}>(url, {id, product_quantity}, {headers: this.headerObj});
  }

  updateCartStatus(user_id: string, cartStatus: string): Observable<Cart> {
    const url = `${this.apiUrl}/update-cart-status/${user_id}`;
    return this.http.put<Cart>(url, {cartStatus}, {headers: this.headerObj});
  }

  removeItemFromCart(id: string): Observable<{id: string | number, cart_id: string, product_id: string, product_quantity: number}> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<{id: string | number, cart_id: string, product_id: string, product_quantity: number}>(url, {headers: this.headerObj});
  }

  countProductsInCart(cart_id: string): Observable<{count: number}>{
    const url = `${this.apiUrl}/count-products-in-cart/${cart_id}`;
    return this.http.get<{count: number}>(url, {headers: this.headerObj});
  }
}
