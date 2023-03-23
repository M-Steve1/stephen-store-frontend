import { Component, OnInit } from '@angular/core';
import { Payment } from 'src/app/models/Payment';
import { ProductsInCart } from 'src/app/models/ProductsInCart';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'server/src/models/order';
import { Cart } from 'src/app/models/Cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  faTimes = faTimes;
  productsInCart: ProductsInCart[] = [];
  totalPrice: number = 0;
  fullName: string = '';
  address: string = '';
  cardNumber: string = '';

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res) => {
      res.forEach(p => {
        if (localStorage.getItem(`item${p.id}`) !== null || undefined) {
          const productQuantity =  localStorage.getItem(`productQuantity${p.id}`);
          p.quantity = parseInt(productQuantity as unknown as string);
          this.productsInCart.unshift(p);
          this.totalPrice += (parseFloat(p.price as unknown as string) * parseInt(productQuantity as unknown as string));
        }
        })
      })
  }
  
  navigate(): void {
    this.router.navigate(['confirmation'], 
    {
      state: {fullName: this.fullName, totalPrice: this.totalPrice}
    })
  }

  calcTotalPrice(product: ProductsInCart): number {
    return (parseFloat(product.price as unknown as string) * parseInt(product.quantity as unknown as string));
  }

  updateQuantity(productId: string | undefined | number, quantity: number | undefined): void {
    this.totalPrice = 0;

    this.productsInCart.forEach(
      (product) => {
        this.totalPrice += this.calcTotalPrice(product);
      }
    )
    localStorage.removeItem(`item${productId}`);
    localStorage.removeItem(`productQuantity${productId}`);
    localStorage.setItem(`item${productId}`, productId as string);
    localStorage.setItem(`productQuantity${productId}`, (quantity as number).toString());
  }

  async createCart(): Promise<string | void> {
    const userId = sessionStorage.getItem('userId') as string;
    const cart: Cart = {
      user_id: userId,
      status: "active"
    }
      this.cartService.create(cart).subscribe( c => {
        if (c !== null || c !== undefined) {
          localStorage.setItem("cartId", c.id as string);
          this.productsInCart.forEach(p => {
            this.cartService.addProductInCart({cart_id: c.id as string, product_id: p.id as string, product_quantity: p.quantity as number}).subscribe(res => {
              if (res !== null || res !== undefined) {
                localStorage.removeItem(`item${res.product_id}`);
                localStorage.removeItem(`productQuantity${res.product_id}`);
              }
            });
          })
        }
      });
  }

  async clearCart(): Promise<void> {
    const user_id = sessionStorage.getItem('userId');
    this.cartService.updateCartStatus(user_id as string, 'completed').subscribe(res => {
      if (res as unknown as string === 'jwt expired') {
        sessionStorage.clear();
        this.router.navigate(['signin']);
      } else {
        this.productsInCart = [];
        return;
      }
    });
  }

  async createOrder():Promise<void> {
    const isLoggedIn = sessionStorage.getItem("myToken");
    if (isLoggedIn) {
      await this.createCart();
      setTimeout(() => {
        const cartId = localStorage.getItem("cartId");
        const userId = sessionStorage.getItem("userId");
        const order: Order = {
          userId: userId as string,
          cartId: cartId as string,
          status: "active"
        }
        this.orderService.createOrder(order).subscribe(async res => {
          if (res as unknown as string === "jwt expired") {
            this.router.navigate(['sigin']);
          } else {
            await this.clearCart();
            this.navigate();
          }
        });
      }, 2000);
    } else {
      this.router.navigate(['sigin']);
    }
  }

  removeItemFromCart(productInCartId: string | undefined | number, productId: string | undefined | number): void {
    const isLoggedIn = sessionStorage.getItem('myToken');


    if (isLoggedIn) {
      this.productsInCart = this.productsInCart.filter(p => {
        return p.productInCartId !== productInCartId;
      })
      this.cartService.removeItemFromCart(productInCartId as string).subscribe(res => {
        if (res as unknown as string === 'jwt expired') {
          sessionStorage.clear();
          this.router.navigate(['signin']);
        } 
      });
    } else {
      this.productsInCart = this.productsInCart.filter(p => {
        return p.id !== productId;
      })
      localStorage.removeItem(`item${productId}`);
      localStorage.removeItem(`productQuantity${productId}`);
    }

    this.totalPrice = 0;
    this.productsInCart.forEach(
      (product) => {
        this.totalPrice += this.calcTotalPrice(product);
      }
    )
  }

  hasRoute(route: string): boolean {
    return this.router.url === route;
  }
}