import { Component, OnInit } from '@angular/core';
import { ProductsInCart } from 'src/app/models/ProductsInCart';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Cart } from 'src/app/models/Cart';
import { Order } from 'src/app/models/Order';

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
  message: string = '';

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res) => {
      res?.forEach(p => {
        if (localStorage.getItem(`item${p.id}`) !== null) {
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

  updateQuantity(productId: undefined | number, quantity: number | undefined): void {
    this.totalPrice = 0;

    this.productsInCart.forEach(
      (product) => {
        this.totalPrice += this.calcTotalPrice(product);
      }
    )
    localStorage.removeItem(`item${productId}`);
    localStorage.removeItem(`productQuantity${productId}`);
    localStorage.setItem(`item${productId}`, (productId as number).toString());
    localStorage.setItem(`productQuantity${productId}`, (quantity as number).toString());
  }

  async createCart(): Promise<string | void> {
    this.message = "Processing....."
    const userId = sessionStorage.getItem('userId') as string;
    const cart: Cart = {
      user_id: parseInt(userId),
      status: "active"
    }
      this.cartService.create(cart).subscribe( c => {
        if (c !== null) {
          localStorage.setItem("cartId", (c.id as number).toString());
          this.productsInCart.forEach(p => {
            this.cartService.addProductInCart({cart_id: c.id as number, product_id: p.id as number, product_quantity: p.quantity as number}).subscribe(res => {
              if (res !== null) {
                localStorage.removeItem(`item${res.product_id}`);
                localStorage.removeItem(`productQuantity${res.product_id}`);
              }
            });
          })
        }
      });
  }

  clearCart(): void {
    this.productsInCart = [];
  }

  async createOrder():Promise<void> {
    const isLoggedIn = sessionStorage.getItem("myToken");
    if (isLoggedIn) {
      this.createCart();
      setTimeout(() => {
        const cartId = localStorage.getItem("cartId");
        const userId = sessionStorage.getItem("userId");
        const order: Order = {
          user_id: parseInt(userId as string),
          cart_id: parseInt(cartId as string),
          status: "active"
        }
        this.orderService.createOrder(order).subscribe(async res => {
          if (res as unknown as string === "jwt expired") {
            this.router.navigate(['sigin']);
          } else {
            this.clearCart();
            this.cartService.updateCartStatus(parseInt(userId as string), "closed").subscribe(res => {
              if (res !== null) {
                this.navigate();
              }
            });
          }
        });
      }, 2000);
    } else {
      this.router.navigate(['signin']);
    }
    // this.message = '';
  }

  removeItemFromCart(productInCartId: undefined | number, productId: undefined | number): void {
    const isLoggedIn = sessionStorage.getItem('myToken');


    if (isLoggedIn) {
      this.productsInCart = this.productsInCart.filter(p => {
        return p.productInCartId?.toString() !== productInCartId?.toString();
      })
      this.cartService.removeItemFromCart(productInCartId as number).subscribe(res => {
        if (res as unknown as string === 'jwt expired') {
          sessionStorage.clear();
          this.router.navigate(['signin']);
        } 
      });
    } else {
      this.productsInCart = this.productsInCart.filter(p => {
        return p.id?.toString() !== productId?.toString();
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