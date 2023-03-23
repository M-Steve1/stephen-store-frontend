import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { Product } from 'src/app/models/Product';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/models/Cart';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{
  products: Product[] & {addedToCart?: string} = [];

  constructor(private productService: ProductService, private orderService: OrderService, private router: Router, private cartService: CartService) {
    this.products = this.router.getCurrentNavigation()
    ?.extras
    .state
    ?.['product']
  }

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.productService.getProducts().subscribe(res => {
      this.products = res;

      this.products.forEach((p) => {
        if (localStorage.getItem(`item${p.id}`) !== null || undefined) {
           //@ts-ignore
           p.addedToCart  = "Added to Cart";
        }
      })
    }) 

  }
}

   // refreshes page to get current update on products in cart
    // Since the url is gotten from th browser and browser replaces space
    // with %20
    reloadPage(productName: string): void {
      const result = productName.replaceAll(' ', '%20');
      if(this.router.url === `/products/${result}`) {
        this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
        this.router.navigate(['products', productName], {
          state: {product: this.products}
        })
      })
    }
  }

createCart(product: Product & {productQuantity: number}): void {
  // prevent adding previously added products instead add to it 
  localStorage.setItem(`item${product.id}`, product.id as string);
  localStorage.setItem(`productQuantity${product.id}`, product.productQuantity.toString());

   
  this.products.find((p) => {
    if (p.id === product.id) {
     //@ts-ignore
     p.addedToCart  = "Added to Cart";
    }
   })

  this.reloadPage(product.name);
    
  }

  hasRoute(route: string): boolean {
    return this.router.url === route;
  }

}
