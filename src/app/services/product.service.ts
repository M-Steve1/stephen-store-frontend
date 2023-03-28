import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';
import { ProductsInCart } from '../models/ProductsInCart';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl: string = 'https://stephenstore-serverside.vercel.app/product';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsInCart[]> {
    const url = `${this.apiUrl}/index`
    return this.http.get<Product[]>(url);
  }

  getProductById(productId: number): Observable<ProductsInCart> {
    const url = `${this.apiUrl}/show/${productId}`;
    return this.http.get<Product>(url);
  }

  getProductByName(productName: string): Observable<Product[]> {
    const url = `${this.apiUrl}/show-product/${productName}`;
    return this.http.get<Product[]>(url);
  }

  createProduct(product: Product): void {
    const token = sessionStorage.getItem('myToken')
    const header_obj = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    const url = `${this.apiUrl}/create`
    this.http.post<Product>(url, product, {headers: header_obj}).subscribe();
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const url = `${this.apiUrl}/category/${category}`;
    return this.http.get<Product[]>(url);
  }

  getAllProductCategories(): Observable<{category: string}[]> {
    const url = `${this.apiUrl}/all-categories`;
    return this.http.get<{category: string}[]>(url);
  }
}
