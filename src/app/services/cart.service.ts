import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, CartProduct } from '../models/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'https://stephenstore-serverside.vercel.app/cart';
  private token = sessionStorage.getItem('myToken');
  private headerObj = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);

  constructor(private http: HttpClient) { }

  create(cart: Cart): Observable<Cart> {
    const url = `${this.apiUrl}/create`;
    return this.http.post<Cart>(url, cart, {headers: this.headerObj});
  }

  addProductInCart(productToAdd: CartProduct): Observable<CartProduct> {
    const url = `${this.apiUrl}/add-product`;
    return this.http.post<CartProduct>(url, productToAdd, {headers: this.headerObj});
  }

  isProductInCart(productInCart: {cart_id: number, product_id: number}): Observable<CartProduct> {
    const url = `${this.apiUrl}/show-product-cart`;
    return this.http.post<CartProduct>(url, productInCart, {headers: this.headerObj});
  }

  getCartByUserId(userId: number): Observable<Cart> {
    const url = `${this.apiUrl}/show-cart/${userId}`;
    return this.http.get<Cart>(url, {headers: this.headerObj});
  }

  getProductsInCart(cartId: number): Observable<CartProduct[]> {
    const url = `${this.apiUrl}/products-in-cart/${cartId}`;
    return this.http.get<CartProduct[]>(url, {headers: this.headerObj});
  }

  updateProductQuantity(id: number, product_quantity: number): Observable<CartProduct> {
    const url = `${this.apiUrl}/update-product-quantity`;
    return this.http.put<CartProduct>(url, {id, product_quantity}, {headers: this.headerObj});
  }

  updateCartStatus(user_id: number, cartStatus: string): Observable<Cart> {
    const url = `${this.apiUrl}/update-cart-status/${user_id}`;
    return this.http.put<Cart>(url, {cartStatus}, {headers: this.headerObj});
  }

  removeItemFromCart(id: number): Observable<CartProduct> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<CartProduct>(url, {headers: this.headerObj});
  }

  countProductsInCart(cart_id: number): Observable<{count: number}>{
    const url = `${this.apiUrl}/count-products-in-cart/${cart_id}`;
    return this.http.get<{count: number}>(url, {headers: this.headerObj});
  }
}
