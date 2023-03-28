import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  cartCount: number = 0;

  constructor(private cartService: CartService, private router: Router){}

  ngOnInit(): void {
   this.countProductsInCart();
  }


  // The reason for placing this here is because I want to always check for changes for the products in the cart
  // since app is the parent element to all other element whenever I hover on any page the cart number is updated.
    countProductsInCart() {
      let count: number = 0;
      // The local storage contains the product and quantity
      // all products key starts with "item"
      for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i)?.substring(0, 4) === "item") {
          count++;
        }
      }
      this.cartCount = count;
    }
   
  }
